import { __awaiter } from "tslib";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import 'multer';
import { makeId } from "../services/make.is";
import { isSafePublicHttpsUrl } from "../dtos/webhooks/webhook.url.validator";
import { ssrfSafeDispatcher } from "../dtos/webhooks/ssrf.safe.dispatcher";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/bmp',
    'image/tiff',
    'video/mp4',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/ogg',
]);
class CloudflareStorage {
    constructor(accountID, accessKey, secretKey, region, _bucketName, _uploadUrl) {
        this.region = region;
        this._bucketName = _bucketName;
        this._uploadUrl = _uploadUrl;
        this._client = new S3Client({
            endpoint: `https://${accountID}.r2.cloudflarestorage.com`,
            region,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
            requestChecksumCalculation: 'WHEN_REQUIRED',
        });
        this._client.middlewareStack.add((next) => (args) => __awaiter(this, void 0, void 0, function* () {
            const request = args.request;
            // Remove checksum headers
            const headers = request.headers;
            delete headers['x-amz-checksum-crc32'];
            delete headers['x-amz-checksum-crc32c'];
            delete headers['x-amz-checksum-sha1'];
            delete headers['x-amz-checksum-sha256'];
            request.headers = headers;
            Object.entries(request.headers).forEach(
            // @ts-ignore
            ([key, value]) => {
                if (!request.headers) {
                    request.headers = {};
                }
                request.headers[key] = value;
            });
            return next(args);
        }), { step: 'build', name: 'customHeaders' });
    }
    uploadSimple(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield isSafePublicHttpsUrl(path))) {
                throw new Error('Unsafe URL');
            }
            const loadImage = yield fetch(path, {
                // @ts-ignore — undici option, not in lib.dom fetch types
                dispatcher: ssrfSafeDispatcher,
            });
            const body = Buffer.from(yield loadImage.arrayBuffer());
            const detected = yield fromBuffer(body);
            if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
                throw new Error('Unsupported file type.');
            }
            const extension = detected.ext;
            const safeContentType = detected.mime;
            const id = makeId(10);
            const params = {
                Bucket: this._bucketName,
                Key: `${id}.${extension}`,
                Body: body,
                ContentType: safeContentType,
                ChecksumMode: 'DISABLED',
            };
            const command = new PutObjectCommand(Object.assign({}, params));
            yield this._client.send(command);
            return `${this._uploadUrl}/${id}.${extension}`;
        });
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detected = yield fromBuffer(file.buffer);
                if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
                    throw new Error('Unsupported file type.');
                }
                const id = makeId(10);
                const extension = detected.ext;
                const safeContentType = detected.mime;
                // Create the PutObjectCommand to upload the file to Cloudflare R2
                const command = new PutObjectCommand({
                    Bucket: this._bucketName,
                    ACL: 'public-read',
                    Key: `${id}.${extension}`,
                    Body: file.buffer,
                    ContentType: safeContentType,
                });
                yield this._client.send(command);
                return {
                    filename: `${id}.${extension}`,
                    mimetype: file.mimetype,
                    size: file.size,
                    buffer: file.buffer,
                    originalname: `${id}.${extension}`,
                    fieldname: 'file',
                    path: `${this._uploadUrl}/${id}.${extension}`,
                    destination: `${this._uploadUrl}/${id}.${extension}`,
                    encoding: '7bit',
                    stream: file.buffer,
                };
            }
            catch (err) {
                console.error('Error uploading file to Cloudflare R2:', err);
                throw err;
            }
        });
    }
    // Implement the removeFile method from IUploadProvider
    removeFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // const fileName = filePath.split('/').pop(); // Extract the filename from the path
            // const command = new DeleteObjectCommand({
            //   Bucket: this._bucketName,
            //   Key: fileName,
            // });
            // await this._client.send(command);
        });
    }
}
export { CloudflareStorage };
export default CloudflareStorage;
//# sourceMappingURL=cloudflare.storage.js.map