export class StudentsMessageSuccess {
  static readonly FIND_ALL = 'Lấy danh sách sinh viên thành công';
  static readonly FIND_ONE = 'Lấy sinh viên thành công';
  static readonly FIND_ONE_CARD = 'Lấy thẻ sinh viên thành công';
  static readonly CREATE = 'Tạo sinh viên thành công';
  static readonly UPDATE = 'Cập nhật sinh viên thành công';
  static readonly DELETE = 'Xóa sinh viên thành công';
}

export class StudentsMessageError {
  static readonly ALREADY_EXISTS = 'Sinh viên đã tồn tại';
  static readonly NOT_FOUND = 'Không tìm thấy sinh viên';
  static readonly CARD_NOT_FOUND = 'Không tìm thấy thẻ sinh viên';

  static readonly STUDENT_CARD_SELFIE_NOT_MATCH =
    'Thẻ sinh viên và ảnh chân dung không khớp';
  static readonly STUDENT_NOT_FOUND = 'Không tìm thấy sinh viên';
  static readonly STUDENT_CARD_NOT_FOUND = 'Không tìm thấy thẻ sinh viên';
}

export default class StudentsMessage {
  static readonly SUCCESS = {
    FIND_ALL: 'Lấy danh sách sinh viên thành công',
    FIND_ONE: 'Lấy thông tin sinh viên thành công',
    CREATE: 'Tạo sinh viên thành công',
    UPDATE: 'Cập nhật thông tin sinh viên thành công',
    DELETE: 'Xóa sinh viên thành công',
  };

  static readonly ERROR = {
    ALREADY_EXISTS: 'Sinh viên đã tồn tại',
    NOT_FOUND: 'Không tìm thấy sinh viên',
    CREATE: 'Tạo sinh viên thất bại',
    UPDATE: 'Cập nhật sinh viên thất bại',
    DELETE: 'Xóa sinh viên thất bại',
  };
}
