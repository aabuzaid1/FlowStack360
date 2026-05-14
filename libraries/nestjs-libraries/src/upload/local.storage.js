import { __awaiter } from "tslib";
import { mkdirSync, unlink, writeFileSync } from 'fs';
// @ts-ignore
import mime from 'mime';
import { isSafePublicHttpsUrl } from "../dtos/webhooks/webhook.url.validator";
import { ssrfSafeDispatcher } from "../dtos/webhooks/ssrf.safe.dispatcher";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');
const LOCAL_STORAGE_ALLOWED_MIME = new Set([
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
export class LocalStorage {
    constructor(uploadDirectory) {
        this.uploadDirectory = uploadDirectory;
    }
    uploadSimple(path) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!(yield isSafePublicHttpsUrl(path))) {
                throw new Error('Unsafe URL');
            }
            const loadImage = yield fetch(path, {
                // @ts-ignore — undici option, not in lib.dom fetch types
                dispatcher: ssrfSafeDispatcher,
            });
            const contentType = ((_a = loadImage === null || loadImage === void 0 ? void 0 : loadImage.headers) === null || _a === void 0 ? void 0 : _a.get('content-type')) ||
                ((_b = loadImage === null || loadImage === void 0 ? void 0 : loadImage.headers) === null || _b === void 0 ? void 0 : _b.get('Content-Type'));
            const findExtension = mime.getExtension(contentType) ||
                path.split('?')[0].split('#')[0].split('.').pop() ||
                'bin';
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const innerPath = `/${year}/${month}/${day}`;
            const dir = `${this.uploadDirectory}${innerPath}`;
            mkdirSync(dir, { recursive: true });
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            const filePath = `${dir}/${randomName}.${findExtension}`;
            const publicPath = `${innerPath}/${randomName}.${findExtension}`;
            // Logic to save the file to the filesystem goes here
            writeFileSync(filePath, Buffer.from(yield loadImage.arrayBuffer()));
            return process.env.FRONTEND_URL + '/uploads' + publicPath;
        });
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detected = yield fromBuffer(file.buffer);
                if (!detected || !LOCAL_STORAGE_ALLOWED_MIME.has(detected.mime)) {
                    throw new Error('Unsupported file type.');
                }
                const safeExt = `.${detected.ext}`;
                const safeMime = detected.mime;
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const innerPath = `/${year}/${month}/${day}`;
                const dir = `${this.uploadDirectory}${innerPath}`;
                mkdirSync(dir, { recursive: true });
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                const filePath = `${dir}/${randomName}${safeExt}`;
                const publicPath = `${innerPath}/${randomName}${safeExt}`;
                writeFileSync(filePath, file.buffer);
                return {
                    filename: `${randomName}${safeExt}`,
                    path: process.env.FRONTEND_URL + '/uploads' + publicPath,
                    mimetype: safeMime,
                    originalname: `${randomName}${safeExt}`,
                };
            }
            catch (err) {
                console.error('Error uploading file to Local Storage:', err);
                throw err;
            }
        });
    }
    removeFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to remove the file from the filesystem goes here
            return new Promise((resolve, reject) => {
                unlink(filePath, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
}
//# sourceMappingURL=local.storage.js.map