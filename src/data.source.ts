import { DataSource } from "typeorm";
import { User } from './user/entities/user.entity';
import { Service } from './service/entities/service.entity';
import { TeamMember } from './member/entities/member.entity';
import { Contact } from './contact/entities/contact.entity';
import { Firm } from './firm/entities/firm.entity';
import { ClientRequestEntity } from './requests/entities/request.entity';

export default new DataSource({
  type: 'postgres',
  host: 'dpg-cv3meqofnakc73eq687g-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'nastyxxaavs_user',
  password: '2bHktO83QaYtLS0cCa01ZM3gpkPjPpEY',
  database: 'nastyxxaavs',
  entities: [ User, Service,TeamMember, Contact, Firm, ClientRequestEntity],
  migrations: ["src/migrations/1741758438236-CreateEntities.ts"],
  migrationsTableName: 'migrations',
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true, //логирование
  synchronize: false, // автоматическая синхронизация схемы
});
