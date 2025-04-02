import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUsers1743582741832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" TYPE VARCHAR(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" TYPE VARCHAR(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE VARCHAR(255)`,
    );
  }
}
