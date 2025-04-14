export class StudentsMessageSuccess {
  static readonly FIND_ALL_SUCCESS = 'Lấy danh sách sinh viên thành công';
  static readonly FIND_ONE_SUCCESS = 'Lấy sinh viên thành công';
  static readonly FIND_ONE_CARD_SUCCESS = 'Lấy thẻ sinh viên thành công';
  static readonly CREATE_SUCCESS = 'Tạo sinh viên thành công';
  static readonly UPDATE_SUCCESS = 'Cập nhật sinh viên thành công';
  static readonly DELETE_SUCCESS = 'Xóa sinh viên thành công';
}

export class StudentsMessageError {
  static readonly STUDENT_EXISTS = 'Sinh viên đã tồn tại';
  static readonly STUDENT_NOT_FOUND = 'Không tìm thấy sinh viên';
  static readonly STUDENT_CARD_NOT_FOUND = 'Không tìm thấy thẻ sinh viên';
}
