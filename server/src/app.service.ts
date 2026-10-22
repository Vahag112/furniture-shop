import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { isLoggedIn } from './auth/guards/auth.guards';
import { AdminGuard } from './admin/guards/admin.guard';
import { join } from 'node:path';
import { unlink } from 'node:fs/promises';
import { UpdateProductDto } from './product.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) { }

  async getProductsList(category?: string) {
    return await this.prisma.product.findMany({
      where: category ? {
        category: {
          slug: category
        }
      } : {},
      orderBy: {id: 'asc'}
    })
  }

  async getProductItem(id: number) {
    return await this.prisma.product.findUnique({
      where: {
        id
      }
    })
  }

  async addProductItem(item: {
    title: string;
    price: number;
    oldPrice?: number | null;
    img: string;
    discount?: number | null;
    categoryId?: number | null;
  }) {
    return this.prisma.product.create({
      data: {
        title: item.title,
        price: item.price,
        oldPrice: item.oldPrice ?? null,
        img: item.img,
        discount: item.discount ?? null,
        categoryId: item.categoryId ?? null,
      },
    });
  }

  async deleteProductItem(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.img) {
      const imagePath = join(
        process.cwd(),
        'uploads',
        'products',
        product.img.split('/').pop()!,
      );

      try {
        await unlink(imagePath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }


  async updateProductItem(id: number, data: UpdateProductDto){
    const product = await this.prisma.product.findUnique({
      where:{
        id
      }
    })

    if(!product){
      throw new NotFoundException('Product not found')
    }

    return this.prisma.product.update({
      where: {
        id
      },
      data
    })
  }


}
