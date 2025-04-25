export class UsersMessageSuccess {
  static readonly FIND_ALL = 'Lấy danh sách người dùng thành công';
  static readonly FIND_ONE = 'Lấy thông tin người dùng thành công';
}

export class UsersMessageError {
  static readonly FIND_ALL_FAILED = 'Lấy danh sách người dùng thất bại';
  static readonly FIND_ONE_FAILED = 'Lấy thông tin người dùng thất bại';
  static readonly USER_NOT_FOUND = 'Người dùng không tồn tại';
}
