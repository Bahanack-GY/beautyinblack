import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: false,
  });

  // Augmenter la limite de taille du corps pour les images base64 (50MB)
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Activer CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Pipe de validation global avec meilleure gestion des erreurs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error('=== ERREURS DE VALIDATION ===');
        console.error(JSON.stringify(errors, null, 2));
        return errors;
      },
    }),
  );

  // Middleware de journalisation des requêtes
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.url.includes('/products')) {
      console.log('=== INCOMING REQUEST ===');
      console.log('Method:', req.method);
      console.log('URL:', req.url);
      console.log('Body keys:', Object.keys(req.body || {}));
      console.log('Body preview:', {
        name: req.body?.name,
        category: req.body?.category,
        price: req.body?.price,
        hasImage: !!req.body?.image,
        imageLength: req.body?.image?.length,
        imagesCount: req.body?.images?.length,
      });
    }
    next();
  });

  // Préfixe global
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
