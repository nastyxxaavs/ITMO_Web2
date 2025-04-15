import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as path from 'node:path';
import { engine } from 'express-handlebars';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { renderPlaygroundPage } from 'graphql-playground-html';
import { ElapsedTimeInterceptor } from './common/elapsed-time.interceptor';
import { ETagInterceptor } from './common/etag.interceptor';

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
      cookie: { secure: false }, // Установить на true в продакшн для HTTPS
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

  app.enableCors({
    origin: true,//'*', // Разрешаем запросы с любых доменов
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'PUT'],
    allowedHeaders: 'Content-Type, Accept',
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API for managing law firm')
    .setVersion('1.0')
    .addTag('contact')
    .addTag('firm')
    .addTag('form')
    .addTag('member')
    .addTag('requests')
    .addTag('service')
    .addTag('user')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory); //the path: /api

  app.getHttpAdapter().getInstance().get('/graphql', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(renderPlaygroundPage({ endpoint: '/graphql' }));
  });


  app.useGlobalInterceptors(new ElapsedTimeInterceptor());
  app.useGlobalInterceptors(new ETagInterceptor());

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();