import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClassTable1743702397457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'class',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '50',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'lecturer_id',
            type: 'varchar',
            length: '20',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_CLASS_LECTURER',
            columnNames: ['lecturer_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['username'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('class', true, true);
  }
}
