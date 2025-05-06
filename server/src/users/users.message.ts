export class UsersMessageSuccess {
  static readonly FIND_ALL = 'Lấy danh sách người dùng thành công';
  static readonly FIND_ONE = 'Lấy thông tin người dùng thành công';
}

export class UsersMessageError {
  static readonly FIND_ALL_FAILED = 'Lấy danh sách người dùng thất bại';
  static readonly FIND_ONE_FAILED = 'Lấy thông tin người dùng thất bại';
  static readonly USER_NOT_FOUND = 'Người dùng không tồn tại';
}

export default class UsersMessage {
  static readonly SUCCESS = {
    FIND_ALL: 'Lấy danh sách người dùng thành công',
    FIND_ONE: 'Lấy thông tin người dùng thành công',
    CHANGE_PASSWORD: 'Đổi mật khẩu thành công',
  };

  static readonly ERROR = {
    FIND_ALL: 'Lấy danh sách người dùng thất bại',
    FIND_ONE: 'Lấy thông tin người dùng thất bại',
    NOT_FOUND: 'Người dùng không tồn tại',
    ALREADY_EXISTS: 'Người dùng đã tồn tại',
    WRONG_PASSWORD: 'Mật khẩu không đúng',
    CHANGE_PASSWORD: 'Đổi mật khẩu thất bại',
  };
}
