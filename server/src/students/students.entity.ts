import { Role } from 'src/role/role.enum';
import { AbstractUser } from 'src/users/user.entity';
import { ChildEntity, Column } from 'typeorm';

@ChildEntity(Role.Student)
export class Student extends AbstractUser {
  get id(): string {
    return this.username;
  }

  set id(id: string) {
    this.username = id;
  }

  @Column({ type: 'character varying', length: 255 })
  course: string;

  @Column({ type: 'character varying', name: 'class_name', length: 255 })
  className: string;

  @Column({ name: 'card_path', type: 'text' })
  cardPath: string;
}
