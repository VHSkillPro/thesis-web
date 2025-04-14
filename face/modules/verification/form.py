from flask_wtf import FlaskForm
from wtforms import StringField, FileField
from wtforms.validators import DataRequired, Regexp
from flask_wtf.file import FileRequired, FileAllowed, FileSize


class VerificationForm(FlaskForm):
    class Meta:
        csrf = False

    image_1 = FileField(
        "image_1",
        validators=[
            FileRequired(message="Vui lòng chọn file ảnh chứa khuôn mặt thứ nhất"),
            FileAllowed(
                ["jpg", "jpeg", "png"],
                message="Chỉ hỗ trợ các định dạng ảnh: jpg, jpeg, png",
            ),
            FileSize(
                max_size=10 * 1024 * 1024,
                message="Kích thước file ảnh không được vượt quá 10MB",
            ),
        ],
    )
    image_2 = FileField(
        "image_2",
        validators=[
            FileRequired(message="Vui lòng chọn file ảnh chứa khuôn mặt thứ hai"),
            FileAllowed(
                ["jpg", "jpeg", "png"],
                message="Chỉ hỗ trợ các định dạng ảnh: jpg, jpeg, png",
            ),
            FileSize(
                max_size=10 * 1024 * 1024,
                message="Kích thước file ảnh không được vượt quá 10MB",
            ),
        ],
    )
    pipeline = StringField(
        "pipeline",
        validators=[
            DataRequired(
                message="Vui lòng chọn pipeline. Các pipeline hiện có: 'yunet+sface', 'retinaface+arcface'"
            ),
            Regexp(
                "^(yunet\+sface|retinaface\+arcface)$",
                message="Pipeline không hợp lệ. Các pipeline hiện có: 'yunet+sface', 'retinaface+arcface'",
            ),
        ],
    )
