export class StudentsMessageSuccess {
  static readonly FIND_ALL_SUCCESS = 'Lấy danh sách sinh viên thành công';
  static readonly FIND_ONE_SUCCESS = 'Lấy sinh viên thành công';
  static readonly CREATE_SUCCESS = 'Tạo sinh viên thành công';
}

export class StudentsMessageError {
  static readonly STUDENT_EXISTS = 'Sinh viên đã tồn tại';
  static readonly STUDENT_NOT_FOUND = 'Không tìm thấy sinh viên';
}
