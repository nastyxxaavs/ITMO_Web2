import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as path from 'node:path';
import * as hbs from 'hbs';
import * as Handlebars from 'handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // await app.listen(process.env.PORT ?? 3000);
  // Получаем порт из переменной окружения или используем порт по умолчанию (4000)
  // const port = process.env.PORT || 4000;

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'data'));

  const viewsPath = path.join(__dirname, '..', 'views');
  hbs.registerPartials(path.join(viewsPath, 'partials'));
  app.setBaseViewsDir(viewsPath);

  app.setViewEngine('hbs');

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();


