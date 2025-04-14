import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFaceTable1744643419184 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "face"
      ALTER COLUMN "embedding" TYPE vector(128);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "face"
      ALTER COLUMN "embedding" TYPE vector(512);
    `);
  }
}
