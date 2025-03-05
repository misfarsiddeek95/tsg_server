/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


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

  // const globalPrefix = "api";
  // app.setGlobalPrefix(globalPrefix);
  // app.enableCors();

  // Swagger implimentaion
  const options = new DocumentBuilder()
    .setTitle('GAA API')
    .setDescription('API documenations of the GAA App backend service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || 3334;
  await app.listen(port);
  Logger.log(
    `🚀 GAA Server is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

// NODE_MODULES_CACHE
// true

// NX_DATABASE_URL
// mysql://z5ltoei0yed0iera:iv787i81pmf9frat@u5v60msuu5shlk4u.chr7pe7iynqr.eu-west-1.rds.amazonaws.com/ses_revamp_app_db
// NX_ORIGINS
// https://ses-node-client-app.herokuapp.com,http://localhost:4200
// ORIGINS
// https://ses-node-client-app.herokuapp.com
// PROCFILE
// apps/backend/Procfile
// PROJECT_NAME
// backend

// heroku/nodejs
// https://buildpack-registry.s3.amazonaws.com/buildpacks/heroku-community/multi-procfile.tgz
