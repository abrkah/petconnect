import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { UPLOADS_ROOT } from './common/uploads-path';

// 👇 ADD THESE
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MulterExceptionFilter } from './common/multer-exception.filter';

function isAllowedCorsOrigin(origin: string, allowedOrigins: Set<string>): boolean {
  const normalized = origin.replace(/\/$/, '');
  return (
    allowedOrigins.has(normalized) ||
    /^https:\/\/[\w-]+\.vercel\.app$/.test(normalized)
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = new Set<string>();
  const frontendUrls = process.env.FRONTEND_URL?.split(',') ?? [];
  for (const raw of frontendUrls) {
    const origin = raw.trim().replace(/\/$/, '');
    if (origin) allowedOrigins.add(origin);
  }

  const applyCorsHeaders = (origin: string | undefined, res: express.Response) => {
    if (origin && isAllowedCorsOrigin(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }
  };

  // Answer browser preflight before auth guards or route handlers run.
  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    applyCorsHeaders(origin, res);
    if (req.method === 'OPTIONS') {
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept',
      );
      res.status(204).end();
      return;
    }
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      callback(null, isAllowedCorsOrigin(origin, allowedOrigins));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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