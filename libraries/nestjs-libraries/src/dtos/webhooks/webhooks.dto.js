import { __decorate, __metadata } from "tslib";
import { IsDefined, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { IsSafeWebhookUrl } from "./webhook.url.validator";
export class WebhooksIntegrationDto {
}
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], WebhooksIntegrationDto.prototype, "id", void 0);
export class WebhooksDto {
}
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], WebhooksDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsUrl(),
    IsDefined(),
    IsSafeWebhookUrl({
        message: 'Webhook URL must be a public HTTPS URL and cannot point to internal network addresses',
    }),
    __metadata("design:type", String)
], WebhooksDto.prototype, "url", void 0);
__decorate([
    Type(() => WebhooksIntegrationDto),
    IsDefined(),
    __metadata("design:type", Array)
], WebhooksDto.prototype, "integrations", void 0);
export class OnlyURL {
}
__decorate([
    IsString(),
    IsUrl(),
    IsDefined(),
    IsSafeWebhookUrl({
        message: 'URL must be a public HTTPS URL and cannot point to internal network addresses',
    }),
    __metadata("design:type", String)
], OnlyURL.prototype, "url", void 0);
export class UpdateDto {
}
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], UpdateDto.prototype, "id", void 0);
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], UpdateDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsUrl(),
    IsDefined(),
    IsSafeWebhookUrl({
        message: 'Webhook URL must be a public HTTPS URL and cannot point to internal network addresses',
    }),
    __metadata("design:type", String)
], UpdateDto.prototype, "url", void 0);
__decorate([
    Type(() => WebhooksIntegrationDto),
    IsDefined(),
    __metadata("design:type", Array)
], UpdateDto.prototype, "integrations", void 0);
//# sourceMappingURL=webhooks.dto.js.map