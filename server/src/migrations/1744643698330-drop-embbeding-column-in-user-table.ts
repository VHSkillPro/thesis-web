import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropEmbbedingColumnInUserTable1744643698330
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" 
            DROP COLUMN "card_embedding";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "card_embedding" vector(512);
        `);
  }
}
