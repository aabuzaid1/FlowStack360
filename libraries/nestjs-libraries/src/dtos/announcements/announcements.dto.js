import { __decorate, __metadata } from "tslib";
import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
export class AnnouncementDto {
}
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], AnnouncementDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsDefined(),
    __metadata("design:type", String)
], AnnouncementDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    IsIn(['INFO', 'WARNING', 'ERROR']),
    __metadata("design:type", String)
], AnnouncementDto.prototype, "color", void 0);
//# sourceMappingURL=announcements.dto.js.map