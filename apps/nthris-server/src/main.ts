/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger implimentaion
  const options = new DocumentBuilder()
    .setTitle('NTHRIS API')
    .setDescription('API documenations of the NTHRIS App backend service')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || 4100;
  await app.listen(port);
  Logger.log(
    `🚀 NTHRIS Server is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
