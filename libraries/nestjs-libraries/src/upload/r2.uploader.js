import { __asyncValues, __awaiter } from "tslib";
import { UploadPartCommand, S3Client, ListPartsCommand, CreateMultipartUploadCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { makeId } from "../services/make.is";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');
const ALLOWED_EXT_TO_MIME = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.bmp': 'image/bmp',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.mp4': 'video/mp4',
};
function normalizeExtension(filename) {
    const ext = path.extname(filename || '').toLowerCase();
    return ALLOWED_EXT_TO_MIME[ext] ? ext : null;
}
const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ACCESS_KEY, CLOUDFLARE_SECRET_ACCESS_KEY, CLOUDFLARE_BUCKETNAME, CLOUDFLARE_BUCKET_URL, } = process.env;
const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_KEY,
        secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});
// Function to generate a random string
function generateRandomString() {
    return makeId(20);
}
export default function handleR2Upload(endpoint, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (endpoint) {
            case 'create-multipart-upload':
                return createMultipartUpload(req, res);
            case 'prepare-upload-parts':
                return prepareUploadParts(req, res);
            case 'complete-multipart-upload':
                return completeMultipartUpload(req, res);
            case 'list-parts':
                return listParts(req, res);
            case 'abort-multipart-upload':
                return abortMultipartUpload(req, res);
            case 'sign-part':
                return signPart(req, res);
        }
        return res.status(404).end();
    });
}
export function simpleUpload(data, originalFilename, _contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        const detected = yield fromBuffer(data);
        if (!detected || !Object.values(ALLOWED_EXT_TO_MIME).includes(detected.mime)) {
            throw new Error('Unsupported file type.');
        }
        const fileExtension = `.${detected.ext}`;
        const safeContentType = detected.mime;
        const randomFilename = generateRandomString() + fileExtension;
        const params = {
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: randomFilename,
            Body: data,
            ContentType: safeContentType,
        };
        const command = new PutObjectCommand(Object.assign({}, params));
        yield R2.send(command);
        return CLOUDFLARE_BUCKET_URL + '/' + randomFilename;
    });
}
export function createMultipartUpload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { file, fileHash } = req.body;
        const safeExt = normalizeExtension((file === null || file === void 0 ? void 0 : file.name) || '');
        if (!safeExt) {
            return res.status(400).json({ message: 'Unsupported file type.' });
        }
        const safeContentType = ALLOWED_EXT_TO_MIME[safeExt];
        const randomFilename = generateRandomString() + safeExt;
        try {
            const params = {
                Bucket: CLOUDFLARE_BUCKETNAME,
                Key: `${randomFilename}`,
                ContentType: safeContentType,
                Metadata: {
                    'x-amz-meta-file-hash': fileHash,
                },
            };
            const command = new CreateMultipartUploadCommand(Object.assign({}, params));
            const response = yield R2.send(command);
            return res.status(200).json({
                uploadId: response.UploadId,
                key: response.Key,
            });
        }
        catch (err) {
            console.log('Error', err);
            return res.status(500).json({ source: { status: 500 } });
        }
    });
}
export function prepareUploadParts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { partData } = req.body;
        const parts = partData.parts;
        const response = {
            presignedUrls: {},
        };
        for (const part of parts) {
            try {
                const params = {
                    Bucket: CLOUDFLARE_BUCKETNAME,
                    Key: partData.key,
                    PartNumber: part.number,
                    UploadId: partData.uploadId,
                };
                const command = new UploadPartCommand(Object.assign({}, params));
                const url = yield getSignedUrl(R2, command, { expiresIn: 3600 });
                // @ts-ignore
                response.presignedUrls[part.number] = url;
            }
            catch (err) {
                console.log('Error', err);
                return res.status(500).json(err);
            }
        }
        return res.status(200).json(response);
    });
}
export function listParts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { key, uploadId } = req.body;
        try {
            const params = {
                Bucket: CLOUDFLARE_BUCKETNAME,
                Key: key,
                UploadId: uploadId,
            };
            const command = new ListPartsCommand(Object.assign({}, params));
            const response = yield R2.send(command);
            return res.status(200).json(response['Parts']);
        }
        catch (err) {
            console.log('Error', err);
            return res.status(500).json(err);
        }
    });
}
export function completeMultipartUpload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d;
        const { key, uploadId, parts } = req.body;
        try {
            const command = new CompleteMultipartUploadCommand({
                Bucket: CLOUDFLARE_BUCKETNAME,
                Key: key,
                UploadId: uploadId,
                MultipartUpload: { Parts: parts },
            });
            const response = yield R2.send(command);
            const safeExt = normalizeExtension(key || '');
            if (!safeExt) {
                yield R2.send(new DeleteObjectCommand({ Bucket: CLOUDFLARE_BUCKETNAME, Key: key }));
                return res.status(400).json({ message: 'Unsupported file type.' });
            }
            const expectedMime = ALLOWED_EXT_TO_MIME[safeExt];
            const head = yield R2.send(new GetObjectCommand({
                Bucket: CLOUDFLARE_BUCKETNAME,
                Key: key,
                Range: 'bytes=0-4100',
            }));
            const chunks = [];
            try {
                // @ts-ignore
                for (var _e = true, _f = __asyncValues(head.Body), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                    _c = _g.value;
                    _e = false;
                    const chunk = _c;
                    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const prefix = Buffer.concat(chunks);
            const detected = yield fromBuffer(prefix);
            if (!detected || detected.mime !== expectedMime) {
                yield R2.send(new DeleteObjectCommand({ Bucket: CLOUDFLARE_BUCKETNAME, Key: key }));
                return res
                    .status(400)
                    .json({ message: 'File contents do not match declared type.' });
            }
            response.Location =
                process.env.CLOUDFLARE_BUCKET_URL +
                    '/' +
                    ((_d = response === null || response === void 0 ? void 0 : response.Location) === null || _d === void 0 ? void 0 : _d.split('/').at(-1));
            return response;
        }
        catch (err) {
            console.log('Error', err);
            return res.status(500).json(err);
        }
    });
}
export function abortMultipartUpload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { key, uploadId } = req.body;
        try {
            const params = {
                Bucket: CLOUDFLARE_BUCKETNAME,
                Key: key,
                UploadId: uploadId,
            };
            const command = new AbortMultipartUploadCommand(Object.assign({}, params));
            const response = yield R2.send(command);
            return res.status(200).json(response);
        }
        catch (err) {
            console.log('Error', err);
            return res.status(500).json(err);
        }
    });
}
export function signPart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { key, uploadId } = req.body;
        const partNumber = parseInt(req.body.partNumber);
        const params = {
            Bucket: CLOUDFLARE_BUCKETNAME,
            Key: key,
            PartNumber: partNumber,
            UploadId: uploadId,
            Expires: 3600,
        };
        const command = new UploadPartCommand(Object.assign({}, params));
        const url = yield getSignedUrl(R2, command, { expiresIn: 3600 });
        return res.status(200).json({
            url: url,
        });
    });
}
//# sourceMappingURL=r2.uploader.js.map