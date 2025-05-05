export class AuthMessageSuccess {
  static readonly LOGIN_SUCCESS = 'Đăng nhập thành công';
  static readonly REFRESH_SUCCESS = 'Làm mới token thành công';
  static readonly ME_SUCCESS = 'Lấy thông tin thành công';
}

export class AuthMessageError {
  static readonly UNAUTHORIZED = 'Vui lòng đăng nhập để tiếp tục';
  static readonly FORBIDDEN = 'Bạn không có quyền truy cập vào tài nguyên này';
  static readonly WRONG_USERNAME_OR_PASSWORD =
    'Tài khoản hoặc mật khẩu không đúng';
  static readonly USER_NOT_ACTIVE = 'Tài khoản không hoạt động';
}

export default class AuthMessage {
  static readonly SUCCESS = {
    LOGIN: 'Đăng nhập thành công',
    REFRESH: 'Làm mới token thành công',
    ME: 'Lấy thông tin thành công',
  };

  static readonly ERROR = {
    UNAUTHORIZED: 'Vui lòng đăng nhập để tiếp tục',
    FORBIDDEN: 'Bạn không có quyền truy cập vào tài nguyên này',
    WRONG_USERNAME_OR_PASSWORD: 'Tài khoản hoặc mật khẩu không đúng',
    USER_NOT_ACTIVE: 'Tài khoản không hoạt động',
  };
}
