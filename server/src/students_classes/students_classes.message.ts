export class StudentsClassesMessageSuccess {
  static readonly FIND_ALL = 'Lấy danh sách sinh viên của lớp học thành công';
  static readonly CREATE = 'Thêm sinh viên vào lớp học thành công';
}

export class StudentsClassesMessageError {
  static readonly NOT_FOUND = 'Không tìm thấy sinh viên này trong lớp học';
  static readonly ALREADY_EXISTS = 'Sinh viên đã có trong lớp học này';
}
