import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cấu hình cho validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that do not have decorators
      forbidNonWhitelisted: true, // throw error when properties are not whitelisted
      transform: true, // transform input data to the correct type
      transformOptions: {
        enableImplicitConversion: true, // convert types implicitly
      },
    }),
  );

  app.enableCors({
    origin: '*',
  });

  // Lấy instance của ConfigService
  const configService = app.get(ConfigService);

  // Tạo tài liệu Swagger từ hàm config
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig(configService),
  );

  // Cấu hình đường dẫn Swagger (http://localhost:3000/doc)
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
