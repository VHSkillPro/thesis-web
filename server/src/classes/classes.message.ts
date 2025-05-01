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

export default class ClassesMessage {
  static readonly SUCCESS = {
    FIND_ALL: 'Lấy danh sách lớp học thành công',
    FIND_ONE: 'Lấy thông tin lớp học thành công',
    CREATE: 'Tạo lớp học thành công',
    UPDATE: 'Cập nhật lớp học thành công',
    DELETE: 'Xóa lớp học thành công',
  };

  static readonly ERROR = {
    NOT_FOUND: 'Không tìm thấy lớp học',
    ALREADY_EXISTS: 'Lớp học đã tồn tại',
    CREATE: 'Tạo lớp học không thành công',
    UPDATE: 'Cập nhật lớp học không thành công',
    DELETE: 'Xóa lớp học không thành công',
  };
}
