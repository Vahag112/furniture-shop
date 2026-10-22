import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  }))
  app.enableCors({
    origin: true,
    credentials: true
  })
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
});
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )

  await app.listen(process.env.PORT ?? 5555);
}
bootstrap();
