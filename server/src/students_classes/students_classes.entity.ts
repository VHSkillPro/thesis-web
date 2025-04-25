import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'student_class' })
export class StudentsClasses {
  @PrimaryColumn({ name: 'student_id', length: 20 })
  studentId: string;

  @PrimaryColumn({ name: 'class_id', length: 50 })
  classId: string;
}
