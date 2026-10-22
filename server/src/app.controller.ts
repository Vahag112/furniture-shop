import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { isLoggedIn } from './auth/guards/auth.guards';
import { AdminGuard } from './admin/guards/admin.guard';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async products(@Query('category') category?: string) {
    return await this.appService.getProductsList(category)
  }


  @Get(':id')
  async productDetail(@Param('id', ParseIntPipe) id: number) {
    const item = await this.appService.getProductItem(id)

    if (!item) {
      throw new NotFoundException('Not found')
    }

    return item
  }



  @UseGuards(isLoggedIn, AdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads/products'),
        filename: (req, file, callback) => {
          const filename = `${randomUUID()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async addProduct(@Body() body: CreateProductDto, @UploadedFile() file: Express.Multer.File,) {
    if (!file) {
      throw new BadRequestException('Product image is required');
    }
    const item = {
      title: body.title,
      price: body.price,
      oldPrice: body.oldPrice ?? null,
      img: `/uploads/products/${file.filename}`,
      discount: body.discount ?? null,
      categoryId: body.categoryId ?? null,
    }

    return this.appService.addProductItem(item);

  }


  @UseGuards(isLoggedIn, AdminGuard)
  @Delete(':id')
  async removeProduct(@Param('id', ParseIntPipe) id: number){
    return await this.appService.deleteProductItem(id)
  }


  @UseGuards(isLoggedIn, AdminGuard)
  @Patch(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body:UpdateProductDto) {
    return await this.appService.updateProductItem(id, body)
  }


}
