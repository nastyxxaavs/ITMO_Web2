// import { MigrationInterface, QueryRunner } from "typeorm";
//
// export class 1741758438236CreateEntities.ts1741784106354 implements MigrationInterface {
//     name = '1741758438236CreateEntities.ts1741784106354'
//
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TYPE "public"."team_member_position_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
//         await queryRunner.query(`CREATE TABLE "team_member" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "position" "public"."team_member_position_enum" NOT NULL, "firmId" integer, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."client_request_entity_status_enum" AS ENUM('0', '1')`);
//         await queryRunner.query(`CREATE TABLE "client_request_entity" ("id" SERIAL NOT NULL, "clientName" character varying NOT NULL, "contactInfo" character varying NOT NULL, "serviceRequested" character varying NOT NULL, "requestDate" TIMESTAMP NOT NULL, "status" "public"."client_request_entity_status_enum" NOT NULL, "firmId" integer, "usersId" integer, CONSTRAINT "PK_5b793510de1eed030db42196d04" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."service_category_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
//         await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "category" "public"."service_category_enum" NOT NULL, "price" integer NOT NULL, "firmId" integer, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "mapsLink" character varying NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TABLE "firm" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_b6e197d72a2ef8bd97a7cbc686e" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('AUTHORIZED', 'UNAUTHORIZED')`);
//         await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('CLIENT', 'ADMIN', 'EMPLOYEE')`);
//         await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'UNAUTHORIZED', "role" "public"."user_role_enum" NOT NULL DEFAULT 'CLIENT', "firmId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_70788c513bbe997e9687ffe71e7" FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "client_request_entity" ADD CONSTRAINT "FK_4df4426b90216396c85ed7ece18" FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "client_request_entity" ADD CONSTRAINT "FK_102b3ce540149a1543d0163f9d8" FOREIGN KEY ("usersId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_b49920e82ae0c53a08fdb416aa5" FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_98fb1817bcb4e3e33196fe970bc" FOREIGN KEY ("firmId") REFERENCES "firm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_98fb1817bcb4e3e33196fe970bc"`);
//         await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_b49920e82ae0c53a08fdb416aa5"`);
//         await queryRunner.query(`ALTER TABLE "client_request_entity" DROP CONSTRAINT "FK_102b3ce540149a1543d0163f9d8"`);
//         await queryRunner.query(`ALTER TABLE "client_request_entity" DROP CONSTRAINT "FK_4df4426b90216396c85ed7ece18"`);
//         await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_70788c513bbe997e9687ffe71e7"`);
//         await queryRunner.query(`DROP TABLE "user"`);
//         await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
//         await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
//         await queryRunner.query(`DROP TABLE "firm"`);
//         await queryRunner.query(`DROP TABLE "contact"`);
//         await queryRunner.query(`DROP TABLE "service"`);
//         await queryRunner.query(`DROP TYPE "public"."service_category_enum"`);
//         await queryRunner.query(`DROP TABLE "client_request_entity"`);
//         await queryRunner.query(`DROP TYPE "public"."client_request_entity_status_enum"`);
//         await queryRunner.query(`DROP TABLE "team_member"`);
//         await queryRunner.query(`DROP TYPE "public"."team_member_position_enum"`);
//     }
//
// }
