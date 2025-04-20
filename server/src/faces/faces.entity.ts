import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Face {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_path', type: 'text' })
  imagePath: string;

  @Column()
  embedding: string;

  @Column({ name: 'student_id' })
  studentId: string;
}
