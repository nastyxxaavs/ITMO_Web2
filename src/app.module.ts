import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './db.config.service';
import { FirmModule } from './firm/firm.module';
import { ContactModule } from './contact/contact.module';
import { MemberModule } from './member/member.module';
import { RequestsModule } from './requests/requests.module';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterImpl } from './exceptionFilter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLRequestContext } from '@apollo/server';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делаем конфигурацию глобальной, чтобы она была доступна в любом месте
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true, // Сортировка схемы по имени
      playground: true,
      plugins: [
        {
          async requestDidStart() {
            return {
              async didResolveOperation({ request, document, schema }: GraphQLRequestContext<any>) {
                const complexity = getComplexity({
                  schema,
                  operationName: request.operationName,
                  query: document!,
                  variables: request.variables,
                  estimators: [
                    fieldExtensionsEstimator(),
                    simpleEstimator({ defaultComplexity: 5 }),
                  ],
                });

                const MAX_COMPLEXITY = 20;

                if (complexity > MAX_COMPLEXITY) {
                  throw new Error(
                    `Запрос слишком сложный: ${complexity}. Максимально допустимая сложность: ${MAX_COMPLEXITY}`,
                  );
                }

                console.log(`Сложность запроса: ${complexity}`);
              },
            };
          },
        }
      ]
    }),
    FirmModule,
    ContactModule,
    MemberModule,
    RequestsModule,
    ServiceModule,
    UserModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_FILTER,
    useClass: ExceptionFilterImpl
  }],
})
export class AppModule {}
