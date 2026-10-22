import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { LoadCurrentUser } from './middleware';
import { CategoriesModule } from './categories/categories.module';
import { ShoppingModule } from './shopping/shopping.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PrismaModule, CategoriesModule, ShoppingModule, AdminModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoadCurrentUser).forRoutes('*');
    }
}
