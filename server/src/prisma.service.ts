import { Injectable, OnModuleDestroy } from "@nestjs/common";
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
    constructor() {
        const pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL
        })
        const adapter = new PrismaPg(pool)

        super({adapter})
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}









