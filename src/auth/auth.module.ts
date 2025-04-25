import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'AUTH_CONFIG',
          useFactory: (configService: ConfigService) => {
            const connectionURI = configService.get<string>('SUPERTOKENS_CONNECTION_URI');
            const apiKey = configService.get<string>('SUPERTOKENS_API_KEY');
            const appName = configService.get<string>('APP_NAME');
            const apiDomain = configService.get<string>('API_DOMAIN');
            const websiteDomain = configService.get<string>('WEBSITE_DOMAIN');


            if (!connectionURI || !appName || !apiDomain || !websiteDomain) {
              throw new Error(
                'One or more required environment variables for SuperTokens are missing'
              );
            }


            supertokens.init({
              framework: 'express',
              supertokens: {
                connectionURI,
                apiKey: apiKey || '', // apiKey можно оставить пустым, если не используется
              },
              appInfo: {
                appName,
                apiDomain,
                websiteDomain,
              },
              recipeList: [EmailPassword.init(), Session.init()],
            });

            return true;
          },
          inject: [ConfigService],
        },
        AuthService,
      ],
      exports: ['AUTH_CONFIG', AuthService],
    };
  }
}
