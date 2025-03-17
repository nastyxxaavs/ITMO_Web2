import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { Service } from './service/entities/service.entity';
import { TeamMember } from './member/entities/member.entity';
import { Contact } from './contact/entities/contact.entity';
import { Firm } from './firm/entities/firm.entity';
import {ClientRequestEntity} from './requests/entities/request.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {
  }
  createTypeOrmOptions(): TypeOrmModuleOptions{
    const host = process.env.DB_HOST;
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_DATABASE;

    return {
      type: 'postgres',
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      entities: [ User, Service,TeamMember, Contact, Firm, ClientRequestEntity],
      migrations: ["src/migrations/1741758438236-CreateEntities.ts"],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true, //логирование
      synchronize: false, // автоматическая синхронизация схемы
    };
  }
}
