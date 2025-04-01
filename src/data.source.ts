import { DataSource } from "typeorm";
import * as path from 'path';

const __dirname = path.resolve();

export default new DataSource({
  type: 'postgres',
  host: 'dpg-cv3meqofnakc73eq687g-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'nastyxxaavs_user',
  password: '2bHktO83QaYtLS0cCa01ZM3gpkPjPpEY',
  database: 'nastyxxaavs',
  entities: [
    path.join(__dirname, './user/entities/*{.ts,.js}'),
    path.join(__dirname, './service/entities/*{.ts,.js}'),
    path.join(__dirname, './member/entities/*{.ts,.js}'),
    path.join(__dirname, './contact/entities/*{.ts,.js}'),
    path.join(__dirname, './firm/entities/*{.ts,.js}'),
    path.join(__dirname, './requests/entities/*{.ts,.js}'),
    path.join(__dirname, './form/entities/*{.ts,.js}')
  ],
  migrations: [path.join(__dirname, './migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true, //логирование
  synchronize: false, // автоматическая синхронизация схемы
});

