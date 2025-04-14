import os
from flask import Flask
import wtforms_json

wtforms_json.init()
os.environ["NO_ALBUMENTATIONS_UPDATE"] = "1"
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB

# Register blueprints
# from modules.detection import bp as face_detect_bp
# from modules.recognize import bp as face_recognize_bp
from modules.verification import bp as verification_bp

app.register_blueprint(verification_bp, url_prefix="/api/verification")

# app.register_blueprint(face_detect_bp, url_prefix="/api/face_detect")
# app.register_blueprint(face_recognize_bp, url_prefix="/api/face_recognize")


@app.route("/")
def hello_world():
    return (
        "Service hỗ trợ các thao tác phát hiện và trích xuất khuôn mặt trong hình ảnh"
    )
