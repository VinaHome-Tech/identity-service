import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import configuration from './config/configuration';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { CustomValidationPipe } from './utils/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('TIDENTITY_SERVICE');
  // Cấu hình CORS
  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: false,
  //   allowedHeaders: 'Content-Type, Authorization',
  // });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(configuration().service.port));
  logger.log(
    `Identity Service is running on port ${configuration().service.port}`,
  );
}
bootstrap();
