import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateUserTable1743699148263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS vector');

    await queryRunner.query(
      `CREATE TABLE "user" (
        "username" VARCHAR(20) PRIMARY KEY,
        "password" VARCHAR(255) NOT NULL,
        "fullname" VARCHAR(255) NOT NULL,
        "course" VARCHAR(255),
        "class_name" VARCHAR(255),
        "is_superuser" BOOLEAN DEFAULT FALSE,
        "is_active" BOOLEAN DEFAULT TRUE,
        "role_id" varchar(255) NOT NULL,
        "card_embedding" vector(512),
        "card_path" TEXT,
        CONSTRAINT FK_ROLE_ID FOREIGN KEY (role_id) REFERENCES role(id)
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true, true);
  }
}
