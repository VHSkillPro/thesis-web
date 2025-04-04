import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRoleTable1743697931824 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.query(
      `INSERT INTO role (id) 
       VALUES ('admin'), 
              ('lecturer'), 
              ('student')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role');
  }
}
