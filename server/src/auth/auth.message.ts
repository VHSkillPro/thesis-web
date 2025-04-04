export class AuthMessage {
  static readonly LOGIN_SUCCESS = 'Đăng nhập thành công';
  static readonly LOGIN_FAILED = 'Đăng nhập thất bại';
  static readonly WRONG_USERNAME_OR_PASSWORD =
    'Tài khoản hoặc mật khẩu không đúng';

  static readonly UNAUTHORIZED = 'Không có quyền truy cập';
  static readonly REFRESH_SUCCESS = 'Làm mới token thành công';
  static readonly ME_SUCCESS = 'Lấy thông tin thành công';
}
