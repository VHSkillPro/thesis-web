import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn, TableInheritance } from 'typeorm';

@Entity({ name: 'user' })
@TableInheritance({ column: { name: 'role_id', type: 'character varying' } })
export abstract class AbstractUser {
  @PrimaryColumn({ type: 'character varying', length: 20 })
  username: string;

  @Exclude()
  @Column({ type: 'character varying', length: 255 })
  password: string;

  @Column({ type: 'character varying', length: 255 })
  fullname: string;

  @Column({ type: 'boolean', name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;
}

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn({ type: 'character varying', length: 20 })
  username: string;

  @Exclude()
  @Column({ type: 'character varying', length: 255 })
  password: string;

  @Column({ type: 'character varying', length: 255 })
  fullname: string;

  @Column({ type: 'boolean', name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'character varying', name: 'role_id', length: 20 })
  roleId: string;
}
