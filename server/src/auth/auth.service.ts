import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { join } from 'path';
import { unlink } from 'fs/promises';



@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }
    async getUser(name: string) {


        return await this.prismaService.user.findUnique({
            where: {
                username: name
            }
        })
    }

    async addUser(user: Prisma.UserCreateInput) {
        await this.prismaService.user.create({
            data: user
        })
    }

    async setRefreshTokenHash(name: string, hash: string | null) {
        await this.prismaService.user.update({
            where: {
                username: name
            },
            data: {
                refreshTokenHash: hash
            }
        })
    }


    async updateAvatar(userId: number, avatar: string) {
        return this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                avatar
            },
            select: {
                id: true,
                username: true,
                avatar: true
            }

        })
    }

    async deleteAvatar(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            },
            select: {
                avatar: true
            }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const filePath = join(
            process.cwd(),
            user.avatar!.replace(/^\/uploads\//, 'uploads/')
        )

        try {
            await unlink(filePath)
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
                throw error
        }

        return this.prismaService.user.update({
            where: { id: userId },
            data: { avatar: null },
            select: {
                id: true,
                username: true,
                avatar: true,
            },
        });
    }



}
