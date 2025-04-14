import os
from flask import Flask
import wtforms_json

wtforms_json.init()
os.environ["NO_ALBUMENTATIONS_UPDATE"] = "1"
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB

# Register blueprints
from modules.common import bp as common_bp
from modules.verification import bp as verification_bp

app.register_blueprint(common_bp, url_prefix="/api")
app.register_blueprint(verification_bp, url_prefix="/api/verification")


@app.route("/")
def hello_world():
    return (
        "Service hỗ trợ các thao tác phát hiện và trích xuất khuôn mặt trong hình ảnh"
    )
