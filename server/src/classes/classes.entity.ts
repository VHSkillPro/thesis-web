import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryColumn({ length: 50 })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'lecturer_id', length: 20 })
  lecturerId: string;
}
