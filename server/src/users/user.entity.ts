import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ length: 20 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  fullname: string;

  @Column({ length: 255, nullable: true })
  course?: string;

  @Column({ name: 'class_name', length: 255, nullable: true })
  className?: string;

  @Column({ name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'role_id', length: 255 })
  roleId: string;

  @Column({ name: 'card_path', type: 'text', nullable: true })
  cardPath?: string;
}
