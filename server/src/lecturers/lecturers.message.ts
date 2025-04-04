export class LecturersMessageSuccess {
  static readonly FIND_ALL_SUCCESS = 'Lấy danh sách giảng viên thành công';
  static readonly FIND_ONE_SUCCESS = 'Lấy thông tin giảng viên thành công';
  static readonly CREATE_SUCCESS = 'Tạo giảng viên thành công';
  static readonly UPDATE_SUCCESS = 'Cập nhật giảng viên thành công';
  static readonly DELETE_SUCCESS = 'Xóa giảng viên thành công';
}

export class LecturersMessageError {
  static readonly LECTURER_EXISTS = 'Giảng viên đã tồn tại';
  static readonly LECTURER_NOT_FOUND = 'Giảng viên không tồn tại';
}
