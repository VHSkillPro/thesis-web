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

  static readonly ALREADY_EXISTS = 'Giảng viên đã tồn tại';
  static readonly NOT_FOUND = 'Giảng viên không tồn tại';
  static readonly CANNOT_DELETE = 'Không thể xóa giảng viên này';
}

export default class LecturersMessage {
  static readonly SUCCESS = {
    FIND_ALL: 'Lấy danh sách giảng viên thành công',
    FIND_ONE: 'Lấy thông tin giảng viên thành công',
    CREATE: 'Tạo giảng viên thành công',
    UPDATE: 'Cập nhật thông tin giảng viên thành công',
    DELETE: 'Xóa giảng viên thành công',
  };

  static readonly ERROR = {
    ALREADY_EXISTS: 'Giảng viên đã tồn tại',
    NOT_FOUND: 'Giảng viên không tồn tại',
    CREATE: 'Tạo giảng viên thất bại',
    UPDATE: 'Cập nhật giảng viên thất bại',
    DELETE: 'Xóa giảng viên thất bại',
  };
}
