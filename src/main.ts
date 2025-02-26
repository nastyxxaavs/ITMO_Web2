import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // await app.listen(process.env.PORT ?? 3000);
  // Получаем порт из переменной окружения или используем порт по умолчанию (4000)
  // const port = process.env.PORT || 4000;
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Регистрируем частичные шаблоны
  AppModule.registerPartials();
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();


