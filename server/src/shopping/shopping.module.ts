import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShoppingService],
  controllers: [ShoppingController],
  exports: [ShoppingService]
})
export class ShoppingModule {}
