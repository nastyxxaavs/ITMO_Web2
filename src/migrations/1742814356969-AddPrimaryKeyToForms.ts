import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrimaryKeyToForms1742814356969 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
    ALTER TABLE "form"
    ADD PRIMARY KEY ("id")
  `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
