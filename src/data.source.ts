import { DataSource } from "typeorm";
import { User } from './user/entities/user.entity';
import { Service } from './service/entities/service.entity';
import { TeamMember } from './member/entities/member.entity';
import { Contact } from './contact/entities/contact.entity';
import { Firm } from './firm/entities/firm.entity';
import { ClientRequestEntity } from './requests/entities/request.entity';
import { Submission } from './form/entities/form.entity';

export default new DataSource({
  type: 'postgres',
  host: 'dpg-cv3meqofnakc73eq687g-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'nastyxxaavs_user',
  password: '2bHktO83QaYtLS0cCa01ZM3gpkPjPpEY',
  database: 'nastyxxaavs',
  entities: [
    __dirname + './contact/entities/*{.ts,.js}',
    __dirname + './firm/entities/*{.ts,.js}',
    __dirname + './form/entities/*{.ts,.js}',
    __dirname + './member/entities/*{.ts,.js}',
    __dirname + './requests/entities/*{.ts,.js}',
    __dirname + './service/entities/*{.ts,.js}',
    __dirname + './user/entities/*{.ts,.js}',
  ],
  migrations: [__dirname + './migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true, //логирование
  synchronize: false, // автоматическая синхронизация схемы
});
