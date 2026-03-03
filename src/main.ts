import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('EasyStretch API')
    .setDescription('Document Api for Exe202 subject')
    .addBearerAuth()
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions = {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  };

  SwaggerModule.setup('api-docs', app, document, customOptions);
  const configService = app.get(ConfigService);
  const post: number = configService.get<number>('PORT') || 3000;
  await app.listen(post);
}
bootstrap();
