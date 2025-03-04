import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
// import { HandlebarsAdapter } from '@nestjs/handlebars';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делаем конфигурацию глобальной, чтобы она была доступна в любом месте
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
/*export class AppModule {
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
}*/
