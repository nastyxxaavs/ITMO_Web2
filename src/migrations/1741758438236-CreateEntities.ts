import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntities1741758438236 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "firm" (
                                "id" SERIAL NOT NULL,
                                "name" VARCHAR NOT NULL,
                                "description" TEXT NOT NULL,
                                PRIMARY KEY ("id")
        )
    `);

        await queryRunner.query(`
        CREATE TABLE "service" (
                                   "id" SERIAL NOT NULL,
                                   "name" VARCHAR NOT NULL,
                                   "description" TEXT NOT NULL,
                                   "category" VARCHAR CHECK (category IN ('Арбитраж/третейские суды', 'Споры с таможней', 'Трудовые споры', 'Контракты', 'Локализация бизнеса', 'Консультирование сельхозпроизводителей')) NOT NULL,
                                   "price" INT NOT NULL,
                                   "firmId" INT,
                                   PRIMARY KEY ("id"),
                                   FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE CASCADE
        )
    `);

        await queryRunner.query(`
        CREATE TABLE "team_member" (
                                       "id" SERIAL NOT NULL,
                                       "firstName" VARCHAR NOT NULL,
                                       "lastName" VARCHAR NOT NULL,
                                       "position" VARCHAR CHECK (position IN ('Начальник отдела', 'Генеральный директор', 'Руководитель практики', 'Помощник юриста', 'Главный бухгалтер', 'Ведущий юрист', 'Младший юрист', 'HR')) NOT NULL,
                                       "firmId" INT,
                                       PRIMARY KEY ("id"),
                                       FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE CASCADE
        )
    `);

        await queryRunner.query(`
        CREATE TABLE "user" (
                                "id" SERIAL NOT NULL,
                                "username" VARCHAR NOT NULL,
                                "password" VARCHAR NOT NULL,
                                "email" VARCHAR NOT NULL,
                                "status" VARCHAR CHECK (status IN ('AUTHORIZED', 'UNAUTHORIZED')) DEFAULT 'UNAUTHORIZED',
                                "role" VARCHAR CHECK (role IN ('CLIENT', 'ADMIN', 'EMPLOYEE')) DEFAULT 'CLIENT',
                                "firmId" INT,
                                PRIMARY KEY ("id"),
                                FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE CASCADE
        )
    `);

        await queryRunner.query(`
        CREATE TABLE "contact" (
                                   "id" SERIAL NOT NULL,
                                   "address" VARCHAR NOT NULL,
                                   "phone" VARCHAR NOT NULL,
                                   "email" VARCHAR NOT NULL,
                                   "mapsLink" VARCHAR NOT NULL,
                                   "firmId" INT,
                                   PRIMARY KEY ("id"),
                                   FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE CASCADE
        )
    `);

        await queryRunner.query(`
      CREATE TABLE "client_request" (
        "id" SERIAL NOT NULL,
        "clientName" VARCHAR NOT NULL,
        "contactInfo" VARCHAR NOT NULL,
        "requestDate" TIMESTAMP NOT NULL,
        "status" VARCHAR CHECK (status IN ('В процессе', 'Завершен')) NOT NULL,
        "firmId" INT,
        "userId" INT,
        "teamMemberId" INT,
        "serviceId" INT,
        PRIMARY KEY ("id"),
        FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
        FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE CASCADE,
        FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE
      )
    `);

        // Создание таблицы для связи "service_team_member"
        await queryRunner.query(`
      CREATE TABLE "service_team_member" (
        "serviceId" INT,
        "teamMemberId" INT,
        PRIMARY KEY ("serviceId", "teamMemberId"),
        FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
        FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE CASCADE
      )
    `);

        // Создание таблицы для связи "service_user"
        await queryRunner.query(`
      CREATE TABLE "service_user" (
        "serviceId" INT,
        "userId" INT,
        PRIMARY KEY ("serviceId", "userId"),
        FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
