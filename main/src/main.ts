import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  console.log(`Server is running on port: ${configService.get<number>('PORT')  || 4000}`);
  await app.listen(configService.get<number>('PORT')  || 4000);
}
bootstrap();
