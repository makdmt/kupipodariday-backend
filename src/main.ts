import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger-module-config';
import helmet from 'helmet';

const SWAGGER_ROUTE = '/api/docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': 'self',
        'scrip-src': ['self'],
        'img-src': '*'
      }
    }
  }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const documentation = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_ROUTE, app, documentation);
  await app.listen(3000);
}
bootstrap();
