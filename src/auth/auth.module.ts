import { Module, DynamicModule } from '@nestjs/common';
import { authConfig } from './auth.config';

@Module({})
export class AuthModule {
  static register(config = authConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: 'AUTH_CONFIG',
          useValue: config,
        },
        // сюда добавьте провайдеры для работы с SuperTokens
      ],
      exports: ['AUTH_CONFIG'],
    };
  }
}