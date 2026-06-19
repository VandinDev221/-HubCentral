import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';

function validateProductionEnv() {
  if (process.env.NODE_ENV !== 'production') return;

  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!process.env.ADMIN_ORIGIN?.trim()) missing.push('ADMIN_ORIGIN');

  if (missing.length > 0) {
    throw new Error(`Variáveis obrigatórias em produção: ${missing.join(', ')}`);
  }
}

async function bootstrap() {
  validateProductionEnv();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1', {
    exclude: [{ path: '', method: RequestMethod.ALL }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const adminOrigin = process.env.ADMIN_ORIGIN?.trim();
  const corsOrigins = adminOrigin
    ? adminOrigin.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  if (corsOrigins.length > 0) {
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    console.log(`CORS ativo para: ${corsOrigins.join(', ')}`);
  } else {
    console.warn('ADMIN_ORIGIN não definido — CORS desativado (browser bloqueará o admin na Vercel)');
  }

  const config = new DocumentBuilder()
    .setTitle('Hub Central API')
    .setDescription('API SaaS - Clientes e Faturamento')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API rodando em http://localhost:${port}/v1`);
  console.log(`Swagger em http://localhost:${port}/api/docs`);
}

bootstrap().catch(console.error);
