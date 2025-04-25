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
