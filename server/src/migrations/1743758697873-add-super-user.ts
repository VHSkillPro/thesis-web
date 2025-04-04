import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class AddSuperUser1743758697873 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    await queryRunner.query(
      `INSERT INTO "user" (username, password, fullname, is_superuser, role_id)
         VALUES ('admin', '${hashedPassword}', 'admin', true, 'admin')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user WHERE username = 'admin'`);
  }
}
