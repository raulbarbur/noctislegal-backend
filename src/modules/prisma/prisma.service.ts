import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is missing in .env');
  
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  super({ adapter } as any);
}

  async onModuleInit() {
    await this.$connect();
  }
}