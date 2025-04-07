from flask import Flask

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB

# Register blueprints
from modules.detection import bp as face_detect_bp

app.register_blueprint(face_detect_bp, url_prefix="/api/face_detect")


@app.route("/")
def hello_world():
    return (
        "Service hỗ trợ các thao tác phát hiện và trích xuất khuôn mặt trong hình ảnh"
    )
