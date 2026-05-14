import { __awaiter, __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
let PrismaService = class PrismaService extends PrismaClient {
    constructor() {
        const schema = getDatabaseSchema();
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ...(schema ? { options: `-c search_path=${schema}` } : {}),
        });
        const adapter = new PrismaPg(pool, schema ? { schema } : undefined);
        super({
            adapter,
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
            ],
        });
    }
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$connect();
        });
    }
    onModuleDestroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$disconnect();
        });
    }
};
function getDatabaseSchema() {
    if (!process.env.DATABASE_URL) {
        return '';
    }
    try {
        return new URL(process.env.DATABASE_URL).searchParams.get('schema') || '';
    }
    catch {
        return '';
    }
}
PrismaService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PrismaService);
export { PrismaService };
let PrismaRepository = class PrismaRepository {
    constructor(_prismaService) {
        this._prismaService = _prismaService;
        this.model = this._prismaService;
    }
};
PrismaRepository = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PrismaRepository);
export { PrismaRepository };
let PrismaTransaction = class PrismaTransaction {
    constructor(_prismaService) {
        this._prismaService = _prismaService;
        this.model = this._prismaService;
    }
};
PrismaTransaction = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PrismaTransaction);
export { PrismaTransaction };
//# sourceMappingURL=prisma.service.js.map
