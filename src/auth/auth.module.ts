import { DynamicModule, Module, Provider } from '@nestjs/common';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { SuperTokensAuthGuard, SuperTokensModule } from 'supertokens-nestjs';
import { UserModule } from '../user/user.module';
import { SuperTokensModuleOptions } from 'supertokens-nestjs/dist/supertokens.types';
import { Reflector } from '@nestjs/core';
import { SupertokensConfig } from './supertokens-config.interface';
import { AuthService } from './auth.service';

@Module({})
export class AuthModule {
  static forRoot(config: { apiKey: any; connectionURI: any }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'SUPERTOKENS_CONFIG',
        useValue: config,
      },
      {
        provide: 'APP_GUARD',
        useClass: SuperTokensAuthGuard,
      },
      AuthService,
      Reflector,
    ];

    return {
      global: true,
      module: AuthModule,
      imports: [UserModule],
    };
  }
}
