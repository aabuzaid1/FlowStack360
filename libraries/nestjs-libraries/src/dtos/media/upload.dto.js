import { __decorate, __metadata } from "tslib";
import { IsDefined, IsString, Validate } from 'class-validator';
import { ValidUrlExtension } from "../../../../helpers/src/utils/valid.url.path";
import { IsSafeWebhookUrl } from "../webhooks/webhook.url.validator";
export class UploadDto {
}
__decorate([
    IsString(),
    IsDefined(),
    Validate(ValidUrlExtension),
    IsSafeWebhookUrl({
        message: 'URL must be a public HTTPS URL and cannot point to internal network addresses',
    }),
    __metadata("design:type", String)
], UploadDto.prototype, "url", void 0);
//# sourceMappingURL=upload.dto.js.map