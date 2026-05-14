import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const schema = getDatabaseSchema();
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
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
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

function getDatabaseSchema() {
  if (!process.env.DATABASE_URL) {
    return '';
  }

  try {
    return new URL(process.env.DATABASE_URL).searchParams.get('schema') || '';
  } catch {
    return '';
  }
}

@Injectable()
export class PrismaRepository<T extends keyof PrismaService> {
  public model: Pick<PrismaService, T>;
  constructor(private _prismaService: PrismaService) {
    this.model = this._prismaService;
  }
}

@Injectable()
export class PrismaTransaction {
  public model: Pick<PrismaService, '$transaction'>;
  constructor(private _prismaService: PrismaService) {
    this.model = this._prismaService;
  }
}
