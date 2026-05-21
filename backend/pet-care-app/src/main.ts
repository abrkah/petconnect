import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { UPLOADS_ROOT } from './common/uploads-path';

// 👇 ADD THESE
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MulterExceptionFilter } from './common/multer-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL?.trim();
  app.enableCors({
    origin: frontendUrl
      ? [frontendUrl, /^https:\/\/.*\.vercel\.app$/]
      : true,
    credentials: true,
  });

  app.useGlobalFilters(new MulterExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use('/uploads', express.static(UPLOADS_ROOT));

  // 👇 Swagger config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document); // 👈 route

  const port = Number(process.env.PORT) || 5003;
  await app.listen(port, '0.0.0.0');
}
bootstrap();