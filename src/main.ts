import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as path from 'node:path';
import { engine } from 'express-handlebars';
//import * as hbs from 'hbs';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import session from 'express-session';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: 'your-secret-key', // Секрет для шифрования сессий
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Установите на true в продакшн для HTTPS
    }),
  );

  server.engine(
    'hbs',
    engine({
      extname: 'hbs',
      defaultLayout: 'general',
      layoutsDir: join(__dirname, '..', 'views'),
      partialsDir: [
        join(__dirname, '..','views/partials/reuse_blocks'),
        join(__dirname, '..','views/partials/content'),
        join(__dirname, '..','views/partials/reuse_elements'),
        join(__dirname, '..','views/partials/structure_blocks'),
        join(__dirname, '..','views/partials/user_status'),
      ],
      helpers: {
        asset: (path: string) => `/public/${path}`,
      },
    }),
  );

  app.setViewEngine('hbs');
  const viewsPath = path.join(__dirname, '..', 'views');
  app.setBaseViewsDir(viewsPath);

  server.use('/public', express.static(join(__dirname, '..', 'public')));
  server.use('/data', express.static(join(__dirname, '..', 'data')));

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();