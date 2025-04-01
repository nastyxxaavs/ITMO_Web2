import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddServiceRequestedToClientRequestEntity1743369472605 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('client_request_entity', new TableColumn({
            name: 'serviceRequested',
            type: 'int',
            isNullable: false,
        }));

        await queryRunner.createForeignKey('client_request_entity', new TableForeignKey({
            columnNames: ['serviceRequested'],
            referencedTableName: 'service',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
