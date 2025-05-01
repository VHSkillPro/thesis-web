export class FacesMessageSuccess {
  static readonly FIND_ALL_SUCCESS = 'Lấy danh sách khuôn mặt thành công';
  static readonly FIND_ONE_SUCCESS = 'Lấy khuôn mặt thành công';
  static readonly CREATE_SUCCESS = 'Tạo khuôn mặt thành công';
  static readonly DELETE_SUCCESS = 'Xóa khuôn mặt thành công';
}

export class FacesMessageError {
  static readonly FACE_NOT_FOUND = 'Khuôn mặt không tồn tại';
}

export default class FacesMessage {
  static readonly SUCCESS = {
    FIND_ALL: 'Lấy danh sách khuôn mặt thành công',
    FIND_ONE: 'Lấy khuôn mặt thành công',
    CREATE: 'Tạo khuôn mặt thành công',
    DELETE: 'Xóa khuôn mặt thành công',
  };

  static readonly ERROR = {
    NOT_FOUND: 'Khuôn mặt không tồn tại',
    CREATE: 'Tạo khuôn mặt thất bại',
    DELETE: 'Xóa khuôn mặt thất bại',
  };
}
