export class StudentsClassesMessageSuccess {
  static readonly FIND_ALL = 'Lấy danh sách sinh viên của lớp học thành công';
  static readonly FIND_ONE = 'Lấy thông tin sinh viên trong lớp học thành công';
  static readonly CREATE = 'Thêm sinh viên vào lớp học thành công';
  static readonly DELETE = 'Xóa sinh viên khỏi lớp học thành công';
}

export class StudentsClassesMessageError {
  static readonly NOT_FOUND = 'Không tìm thấy sinh viên này trong lớp học';
  static readonly ALREADY_EXISTS = 'Sinh viên đã có trong lớp học này';
}

export default class StudentsClassesMessage {
  static readonly SUCCESS = {
    FIND_ALL: StudentsClassesMessageSuccess.FIND_ALL,
    FIND_ONE: StudentsClassesMessageSuccess.FIND_ONE,
    CREATE: StudentsClassesMessageSuccess.CREATE,
    DELETE: StudentsClassesMessageSuccess.DELETE,
  };

  static readonly ERROR = {
    NOT_FOUND: StudentsClassesMessageError.NOT_FOUND,
    ALREADY_EXISTS: StudentsClassesMessageError.ALREADY_EXISTS,
    CREATE: 'Thêm sinh viên vào lớp học thất bại',
    DELETE: 'Xóa sinh viên khỏi lớp học thất bại',
  };
}
