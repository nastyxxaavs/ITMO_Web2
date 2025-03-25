import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormsEntityAndEditOthers1742812964083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "form" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL
     )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
