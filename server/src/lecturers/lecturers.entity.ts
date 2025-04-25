import { Role } from 'src/role/role.enum';
import { AbstractUser } from 'src/users/user.entity';
import { ChildEntity } from 'typeorm';

@ChildEntity(Role.Lecturer)
export class Lecturer extends AbstractUser {
  get id(): string {
    return this.username;
  }

  set id(id: string) {
    this.username = id;
  }
}
