import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as path from 'node:path';
import { engine } from 'express-handlebars';
import express from 'express';
import supertokens from 'supertokens-node';
import session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { renderPlaygroundPage } from 'graphql-playground-html';
import { ElapsedTimeInterceptor } from './common/elapsed-time.interceptor';
import { ETagInterceptor } from './common/etag.interceptor';
import { middleware as superTokensMiddleware } from 'supertokens-node/framework/express';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import { UserService } from './user/user.service';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
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

  app.engine(
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

  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.use('/data', express.static(join(__dirname, '..', 'data')));

  // app.enableCors({
  //   origin: true,//'*', // Разрешаем запросы с любых доменов
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'PUT'],
  //   allowedHeaders: 'Content-Type, Accept',
  // });

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:8082',
    credentials: true, //  чтобы куки передавались
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-csrf-token', // важно для SuperTokens
      'rid',          // SuperTokens internal header
    ],
  });

  const userService = app.get(UserService);
  supertokens.init({
    debug: true,
    appInfo: {
      appName: 'm3311-avsyukevich',
      apiDomain: 'http://localhost:8082',
      websiteDomain: 'http://localhost:8082',
    },
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    recipeList: [
      EmailPassword.init({
        override: {
          apis: (original) => ({
            ...original,
            signUpPOST: async (input) => {

              if (!original.signUpPOST) {
                throw new Error('signUpPOST is not defined');
              }

              const response = await original.signUpPOST!(input);

              if (response.status === 'OK') {
                const email = response.user.emails?.[0];
                if (!email) throw new Error('Email not found');

                const appUser = await userService.createFromSupertokensUser({
                  id: response.user.id,
                  email,
                });

                await response.session.mergeIntoAccessTokenPayload({
                  username: appUser.username,
                  isAuthenticated: true,
                });
              }

              return response;
            },

            signInPOST: async function (input) {
              if (!original.signInPOST) {
                throw new Error('signInPOST is not defined');
              }

              const response = await original.signInPOST(input);

              if (response.status === 'OK') {
                const appUser = await userService.findBySupertokensId(response.user.id);
                if (!appUser) throw new Error('User not found');

                await response.session.mergeIntoAccessTokenPayload({
                  username: appUser.username,
                  isAuthenticated: true,
                });
              }
              return response;
            },
          }),
        },
      }),
      Session.init(),
    ],
  });

  app.use(superTokensMiddleware());
  app.useGlobalFilters(new SuperTokensExceptionFilter());


  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API for managing law firm')
    .setVersion('1.0')
    .addCookieAuth('sAccessToken')
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