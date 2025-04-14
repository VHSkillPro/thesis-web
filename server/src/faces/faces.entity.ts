import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Face {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_path', type: 'text' })
  imagePath: string;
}
