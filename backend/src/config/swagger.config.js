import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = (configService: ConfigService) => {
  return new DocumentBuilder()
    .setTitle(configService.get('APP_NAME', 'default app'))
    .setDescription(
      configService.get('SWAGGER_DESCRIPTION', 'The API description'),
    )
    .setVersion(configService.get('SWAGGER_VERSION', '1.0'))
    .addBearerAuth()
    .build();
};
