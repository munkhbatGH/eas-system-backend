import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/http.exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://munkhbatgh.github.io',
    ],
    credentials: true, // if you're sending cookies or auth headers
  });

  const config = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .addBasicAuth()
    .setTitle('Eas System')
    .setDescription('Eas System API description')
    .setVersion('1.0')
    .addTag('eas-system')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  

  const configService = app.get(ConfigService);
  console.log(`Server is running on port: ${configService.get<number>('PORT')  || 4000}`);
  await app.listen(configService.get<number>('PORT')  || 4000)
}
bootstrap();
