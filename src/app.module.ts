import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// @ts-ignore
import { HandlebarsAdapter } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делаем конфигурацию глобальной, чтобы она была доступна в любом месте
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static configure(consumer: any) {
    consumer.setViewEngine(new HandlebarsAdapter());
  }

  // static registerAllPartials(){
  //   hbs.registerPartials(path.join(viewsPath, 'partials', 'content'));
  //   hbs.registerPartials(__dirname + '/views/partials');
  //   hbs.registerPartials(__dirname + '/views/partials/content');
  //   hbs.registerPartials(__dirname + '/views/partials/reuse_blocks');
  //   hbs.registerPartials(__dirname + '/views/partials/user_status');
  // }
}
