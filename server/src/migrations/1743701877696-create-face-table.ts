import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFaceTable1743701877696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "face" (
            "id" SERIAL PRIMARY KEY,
            "embedding" vector(512) NOT NULL,
            "image_path" TEXT NOT NULL,
            "student_id" varchar(20) NOT NULL,
            CONSTRAINT "FK_STUDENT_ID" FOREIGN KEY ("student_id") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE CASCADE
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('face', true, true);
  }
}
