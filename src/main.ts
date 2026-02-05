import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ServerConfigService } from './models/server-config/server-config.service';
import { CONSTANTS } from 'sea-platform-helpers';
import { IpMiddleware } from './middlewares/ip.middleware';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ServerConfigService);

  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);

  app.setGlobalPrefix('/api');

  const origin = (configService.get('CORS_ORIGIN') + '').split(',');

  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      CONSTANTS.Server.DEVICE_ID_HEADER_KEY,
    ],
    credentials: true,
  });
  app.use(cookieParser());

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          fontSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },

      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SEA Platform Microservice')
    .setDescription('API Docs of the SEA Platform Microservice application')
    // .addBearerAuth()
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Use "sea-platform-jwt"',
      },
      'sea-platform-jwt', // name of the security scheme
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: CONSTANTS.Server.DEVICE_ID_HEADER_KEY,
        in: 'header',
        description: 'Device ID',
      },
      'deviceId', // name of the security scheme
    )
    .addSecurityRequirements('sea-platform-jwt')
    .addSecurityRequirements('deviceId')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const swaggerBaseUrl =
    configService.get('NODE_ENV') === 'production'
      ? '/platform/api/docs'
      : '/api/docs';

  SwaggerModule.setup(swaggerBaseUrl, app, documentFactory, {
    customSiteTitle: 'SEA Platform Microservice',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
    }),
  );

  app.use(new IpMiddleware().use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
