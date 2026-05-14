import { __awaiter, __decorate } from "tslib";
import { BadRequestException, Injectable, } from '@nestjs/common';
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
]);
let CustomFileValidationPipe = class CustomFileValidationPipe {
    transform(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value || typeof value !== 'object') {
                return value;
            }
            // Skip non-file parameters (org, body, query, etc.)
            if (!('buffer' in value) && !('mimetype' in value) && !('fieldname' in value)) {
                return value;
            }
            if (!value.buffer || !Buffer.isBuffer(value.buffer)) {
                throw new BadRequestException('Invalid file upload.');
            }
            const detected = yield fromBuffer(value.buffer);
            if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
                throw new BadRequestException('Unsupported file type.');
            }
            const maxSize = this.getMaxSize(detected.mime);
            if (value.size > maxSize) {
                throw new BadRequestException(`File size exceeds the maximum allowed size of ${maxSize} bytes.`);
            }
            value.mimetype = detected.mime;
            const safeBase = (value.originalname || 'upload')
                .replace(/\.[^./\\]*$/, '')
                .replace(/[\\/]/g, '_')
                .slice(0, 100) || 'upload';
            value.originalname = `${safeBase}.${detected.ext}`;
            return value;
        });
    }
    getMaxSize(mimeType) {
        if (mimeType.startsWith('image/')) {
            return 10 * 1024 * 1024; // 10 MB
        }
        else if (mimeType.startsWith('video/')) {
            return 1024 * 1024 * 1024; // 1 GB
        }
        else {
            throw new BadRequestException('Unsupported file type.');
        }
    }
};
CustomFileValidationPipe = __decorate([
    Injectable()
], CustomFileValidationPipe);
export { CustomFileValidationPipe };
//# sourceMappingURL=custom.upload.validation.js.map