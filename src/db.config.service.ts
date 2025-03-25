import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { Service } from './service/entities/service.entity';
import { TeamMember } from './member/entities/member.entity';
import { Contact } from './contact/entities/contact.entity';
import { Firm } from './firm/entities/firm.entity';
import {ClientRequestEntity} from './requests/entities/request.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Submission } from './form/entities/form.entity';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {
  }
  createTypeOrmOptions(): TypeOrmModuleOptions{
    const host = this.configService.get<string>('DB_HOST');
    const port = parseInt(this.configService.get<string>('DB_PORT') || '5432', 10);
    const username = this.configService.get<string>('DB_USERNAME');
    const password = this.configService.get<string>('DB_PASSWORD');
    const database = this.configService.get<string>('DB_DATABASE');

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      entities: [
        __dirname + './contact/entities/*{.ts,.js}',
        __dirname + './firm/entities/*{.ts,.js}',
        __dirname + './form/entities/*{.ts,.js}',
        __dirname + './member/entities/*{.ts,.js}',
        __dirname + './requests/entities/*{.ts,.js}',
        __dirname + './service/entities/*{.ts,.js}',
        __dirname + './user/entities/*{.ts,.js}',
      ],
      migrations: [__dirname + './migrations/*{.ts,.js}'],//["src/migrations/*"],
      migrationsRun: true,
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
      ///autoLoadEntities: true,
      logging: true, //логирование
      synchronize: false, // автоматическая синхронизация схемы
    };
  }
}
