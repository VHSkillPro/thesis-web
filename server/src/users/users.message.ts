export class UsersMessage {
  static readonly FIND_ALL_SUCCESS = 'Lấy danh sách người dùng thành công';
  static readonly FIND_ALL_FAILED = 'Lấy danh sách người dùng thất bại';

  static readonly FIND_ONE_SUCCESS = 'Lấy thông tin người dùng thành công';
  static readonly USER_NOT_FOUND = 'Người dùng không tồn tại';

  static readonly CREATE_SUCCESS = 'Tạo người dùng thành công';
  static readonly USER_EXISTS = 'Người dùng đã tồn tại';

  static readonly DELETE_SUCCESS = 'Xóa người dùng thành công';
  static readonly CANNOT_DELETE_SELF = 'Không thể xóa chính mình';
  static readonly CANNOT_DELETE_SUPER = 'Không thể xóa người dùng quản trị';
}
