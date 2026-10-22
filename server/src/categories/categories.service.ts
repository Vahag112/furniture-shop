import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prismaService: PrismaService){}

    async getCategories(){
        return await this.prismaService.category.findMany()
    }
}
