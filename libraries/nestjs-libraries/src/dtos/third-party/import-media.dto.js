import { __decorate, __metadata } from "tslib";
import { Type } from 'class-transformer';
import { ArrayMinSize, IsDefined, IsString, ValidateNested, } from 'class-validator';
import { IsSafeWebhookUrl } from "../webhooks/webhook.url.validator";
export class ImportMediaItemDto {
}
__decorate([
    IsString(),
    IsDefined(),
    IsSafeWebhookUrl({
        message: 'URL must be a public HTTPS URL and cannot point to internal network addresses',
    }),
    __metadata("design:type", String)
], ImportMediaItemDto.prototype, "url", void 0);
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], ImportMediaItemDto.prototype, "name", void 0);
export class ImportMediaDto {
}
__decorate([
    ValidateNested({ each: true }),
    Type(() => ImportMediaItemDto),
    ArrayMinSize(1),
    IsDefined(),
    __metadata("design:type", Array)
], ImportMediaDto.prototype, "items", void 0);
//# sourceMappingURL=import-media.dto.js.map