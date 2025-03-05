import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // DTO Config

  // Swagger implimentaion
  const options = new DocumentBuilder()
    .setTitle('GOA API')
    .setDescription('API documenations of the GOA App backend service')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || 3335;
  await app.listen(port);
  Logger.log(
    `🚀 GOA Server is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
