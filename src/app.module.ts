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
    FirmModule,
    ContactModule,
    MemberModule,
    RequestsModule,
    ServiceModule,
    UserModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
