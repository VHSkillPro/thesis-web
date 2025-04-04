import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateStudentClassTable1743758476509
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'student_class',
        columns: [
          {
            name: 'student_id',
            type: 'varchar',
            length: '20',
            isPrimary: true,
          },
          {
            name: 'class_id',
            type: 'varchar',
            length: '50',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_STUDENT_CLASS_STUDENT',
            columnNames: ['student_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['username'],
          },
          {
            name: 'FK_STUDENT_CLASS_CLASS',
            columnNames: ['class_id'],
            referencedTableName: 'class',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('student_class', true, true);
  }
}
