import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTableUsers1743416361225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'username',
            type: 'varchar',
            isPrimary: true,
            length: '150',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'is_superuser',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_USERNAME',
        columnNames: ['username'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USER_USERNAME');
    await queryRunner.dropTable('users');
  }
}
