import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateSuperuser1743478348228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const superuser = {
      username: 'admin',
      password: 'admin',
      is_superuser: true,
      is_active: true,
    };

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(superuser.password, saltOrRounds);

    await queryRunner.query(`
        INSERT INTO users (username, password, is_superuser, is_active)
        VALUES ('${superuser.username}', '${hashedPassword}', ${superuser.is_superuser}, ${superuser.is_active});
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM users WHERE username = 'admin';
    `);
  }
}
