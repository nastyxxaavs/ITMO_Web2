import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './db.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делаем конфигурацию глобальной, чтобы она была доступна в любом месте
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
     // useFactory: async (databaseConfigService: DatabaseConfigService) => {
     //   return databaseConfigService.getTypeOrmConfig();
      ////},
      //inject: [DatabaseConfigService],
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
