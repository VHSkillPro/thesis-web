export class ClassesMessageSuccess {
  static readonly FIND_ALL = 'Lấy danh sách lớp học thành công';
  static readonly FIND_ONE = 'Lấy thông tin lớp học thành công';
  static readonly CREATE = 'Tạo lớp học thành công';
  static readonly UPDATE = 'Cập nhật lớp học thành công';
  static readonly DELETE = 'Xóa lớp học thành công';
}

export class ClassesMessageError {
  static readonly NOT_FOUND = 'Không tìm thấy lớp học';
  static readonly ALREADY_EXISTS = 'Lớp học đã tồn tại';
}
