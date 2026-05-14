import { __decorate, __metadata } from "tslib";
import { IsIn } from 'class-validator';
export class ChangePostStatusDto {
}
__decorate([
    IsIn(['draft', 'schedule']),
    __metadata("design:type", String)
], ChangePostStatusDto.prototype, "status", void 0);
//# sourceMappingURL=change.post.status.dto.js.map