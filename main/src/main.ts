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
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://munkhbatgh.github.io',
      ];
    
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('✅ Allowed by CORS:', origin);
        callback(null, true);
      } else {
        console.warn('⛔ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'ngrok-skip-browser-warning', // ✅ Add this!
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });


  // Add request logging
  app.use((req, res, next) => {
    // console.log('📥 Request:', req.method, req.url);
    // console.log('📋 Headers:', req.headers);
    next();
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
