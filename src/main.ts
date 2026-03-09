import 'reflect-metadata';
import * as dotenv from 'dotenv';
// Cargar variables de entorno antes que cualquier otra cosa
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               
    forbidNonWhitelisted: true,    
    transform: true,               
    transformOptions: {
      enableImplicitConversion: true, 
    },
  }));


  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('---');
  console.log(`ERP Backend operativo en: http://localhost:${port}/api`);
  console.log(`Validación estricta activada`);
  console.log('---');
}

bootstrap();