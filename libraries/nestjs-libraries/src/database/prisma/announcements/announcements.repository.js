import { __decorate, __metadata } from "tslib";
import { PrismaRepository } from "../prisma.service";
import { Injectable } from '@nestjs/common';
import { AnnouncementColor } from '@prisma/client';
let AnnouncementsRepository = class AnnouncementsRepository {
    constructor(_announcements) {
        this._announcements = _announcements;
    }
    getAnnouncements() {
        return this._announcements.model.announcement.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    createAnnouncement(body) {
        return this._announcements.model.announcement.create({
            data: {
                title: body.title,
                description: body.description,
                color: body.color || AnnouncementColor.INFO,
            },
        });
    }
    deleteAnnouncement(id) {
        return this._announcements.model.announcement.delete({
            where: {
                id,
            },
        });
    }
};
AnnouncementsRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaRepository])
], AnnouncementsRepository);
export { AnnouncementsRepository };
//# sourceMappingURL=announcements.repository.js.map