import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ShoppingModule } from '../shopping/shopping.module';

@Module({
    imports: [ShoppingModule],
    controllers: [AdminController]
})
export class AdminModule {}
