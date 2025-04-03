import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLecturersTable1743585461754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lecturers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'firstname',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'lastname',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '150',
            isUnique: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['username'],
            referencedTableName: 'users',
            referencedColumnNames: ['username'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lecturers');
  }
}
