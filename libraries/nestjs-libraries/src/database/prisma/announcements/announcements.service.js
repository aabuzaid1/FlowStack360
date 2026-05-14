import { __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
import { AnnouncementsRepository } from "./announcements.repository";
let AnnouncementsService = class AnnouncementsService {
    constructor(_announcementsRepository) {
        this._announcementsRepository = _announcementsRepository;
    }
    getAnnouncements() {
        return this._announcementsRepository.getAnnouncements();
    }
    createAnnouncement(body) {
        return this._announcementsRepository.createAnnouncement(body);
    }
    deleteAnnouncement(id) {
        return this._announcementsRepository.deleteAnnouncement(id);
    }
};
AnnouncementsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AnnouncementsRepository])
], AnnouncementsService);
export { AnnouncementsService };
//# sourceMappingURL=announcements.service.js.map