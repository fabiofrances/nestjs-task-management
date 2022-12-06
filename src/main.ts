import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './helpers/transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const looger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000;
  await app.listen(port);
  looger.log(`Aplication listen on port ${port}`);
}
bootstrap();
