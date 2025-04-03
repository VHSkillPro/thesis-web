import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'lecturers' })
export class Lecturer {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column({ length: 100 })
  username: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'username' })
  user: User;
}
