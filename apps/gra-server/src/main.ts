import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = process.env.NX_ORIGINS.split(',');

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('GRA API')
    .setDescription('API documenations of the GRA App backend service')
    .setVersion('1.0')
    // .addTag('GRA')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || process.env.NX_PORT || 3002;
  await app.listen(port);
  Logger.log(
    `🚀 GRA Server is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
