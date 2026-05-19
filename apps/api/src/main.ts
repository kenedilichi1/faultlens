import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.get('server');
  const port = appConfig?.port || 4000;

  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('FaultLens API')
    .setDescription(
      'AI-powered incident intelligence and observability platform',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  console.log('FaultLens API is running on', `http://localhost:${port}`);
  console.log(
    'FaultLens Swagger is running on',
    `http://localhost:${port}/api/docs`,
  );
}
bootstrap();
