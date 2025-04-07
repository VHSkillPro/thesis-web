from flask_wtf import FlaskForm
from wtforms import FloatField, StringField, FileField
from wtforms.validators import DataRequired, Regexp, NumberRange, Optional
from flask_wtf.file import FileRequired, FileAllowed, FileSize


class DetectFaceForm(FlaskForm):
    model = StringField(
        "model",
        validators=[
            DataRequired(
                message="Vui lòng chọn model. Các model hiện có: 'yunet', 'retinaface'"
            ),
            Regexp(
                "^(yunet|retinaface)$",
                message="Model không hợp lệ. Các model hiện có: 'yunet', 'retinaface'",
            ),
        ],
    )
    threshold = FloatField(
        "threshold",
        validators=[
            Optional(),
            NumberRange(
                min=0.0,
                max=1.0,
                message="Ngưỡng phát hiện khuôn mặt phải nằm trong khoảng từ 0 đến 1",
            ),
        ],
    )
    image = FileField(
        "image",
        validators=[
            FileRequired(message="Vui lòng chọn file ảnh"),
            FileAllowed(
                ["jpg", "jpeg", "png"],
                message="Chỉ hỗ trợ các định dạng ảnh: jpg, jpeg, png, bmp, webp",
            ),
            FileSize(
                max_size=10 * 1024 * 1024,
                message="Kích thước file ảnh không được vượt quá 10MB",
            ),
        ],
    )


class DetectSingleFaceForm(FlaskForm):
    threshold = FloatField(
        "threshold",
        validators=[
            Optional(),
            NumberRange(
                min=0.0,
                max=1.0,
                message="Ngưỡng phát hiện khuôn mặt phải nằm trong khoảng từ 0 đến 1",
            ),
        ],
    )
    image = FileField(
        "image",
        validators=[
            FileRequired(message="Vui lòng chọn file ảnh"),
            FileAllowed(
                ["jpg", "jpeg", "png"],
                message="Chỉ hỗ trợ các định dạng ảnh: jpg, jpeg, png, bmp, webp",
            ),
            FileSize(
                max_size=10 * 1024 * 1024,
                message="Kích thước file ảnh không được vượt quá 10MB",
            ),
        ],
    )
