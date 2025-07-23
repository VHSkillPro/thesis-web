# Thesis Website

## 1. Hướng dẫn cài đặt

### 1.1. Cài đặt docker và docker-compose
- Cài đặt Docker: [Hướng dẫn cài đặt Docker](https://docs.docker.com/get-docker/)
- Cài đặt Docker Compose: [Hướng dẫn cài đặt Docker Compose](https://docs.docker.com/compose/install/)

### 1.2. Clone repository
- Sử dụng lệnh sau để clone repository về máy:
```bash
git clone https://github.com/VHSkillPro/thesis-web.git
cd thesis-web
```
- Tải các models cần thiết:
```bash
git lfs install
git lfs pull
```

### 1.3. Cấu hình file `.env` trong module server
- Tạo file `.env` trong thư mục `server` và cấu hình các biến môi trường cần thiết:
```env
SECRET_KEY # Khóa bí mật dùng để mã hóa dữ liệu
ACCESS_SECRET_KEY # Khóa bí mật dùng để mã hóa access token
REFRESH_SECRET_KEY # Khóa bí mật dùng để mã hóa refresh token
ACCESS_TOKEN_LIFETIME # Thời gian sống của access token (tính bằng giây)
REFRESH_TOKEN_LIFETIME # Thời gian sống của refresh token (tính bằng giây)

DATABASE_HOST # Tên service của PostgreSQL trong docker-compose
DATABASE_PORT # Cổng kết nối đến PostgreSQL
DATABASE_USER # Tên người dùng PostgreSQL
DATABASE_PASSWORD # Mật khẩu người dùng PostgreSQL
DATABASE_NAME # Tên cơ sở dữ liệu PostgreSQL

FLUTTER_API_KEY # Khóa API của Flutter
```

### 1.4. Chạy ứng dụng
- Chạy lệnh sau để khởi động ứng dụng:
```bash
docker-compose up --build
```