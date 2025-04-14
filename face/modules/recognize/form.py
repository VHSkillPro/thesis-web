from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired, FileAllowed, FileSize
from wtforms import FieldList, FileField, FloatField, Form, FormField, StringField
from wtforms.validators import DataRequired, NumberRange, Regexp


class BBoxForm(Form):
    x = FloatField("x", validators=[DataRequired(message="Vui lòng nhập tọa độ x")])
    y = FloatField("y", validators=[DataRequired(message="Vui lòng nhập tọa độ y")])
    w = FloatField("w", validators=[DataRequired(message="Vui lòng nhập chiều rộng")])
    h = FloatField("h", validators=[DataRequired(message="Vui lòng nhập chiều cao")])


class LandmarkForm(Form):
    left_eye = FieldList(
        FloatField(
            "left_eye",
            validators=[DataRequired(message="Vui lòng nhập tọa độ mắt trái")],
        ),
        min_entries=2,
        max_entries=2,
    )
    right_eye = FieldList(
        FloatField(
            "right_eye",
            validators=[DataRequired(message="Vui lòng nhập tọa độ mắt phải")],
        ),
        min_entries=2,
        max_entries=2,
    )
    nose = FieldList(
        FloatField(
            "nose", validators=[DataRequired(message="Vui lòng nhập tọa độ mũi")]
        ),
        min_entries=2,
        max_entries=2,
    )
    left_mouth = FieldList(
        FloatField(
            "left_mouth",
            validators=[DataRequired(message="Vui lòng nhập tọa độ miệng trái")],
        ),
        min_entries=2,
        max_entries=2,
    )
    right_mouth = FieldList(
        FloatField(
            "right_mouth",
            validators=[DataRequired(message="Vui lòng nhập tọa độ miệng phải")],
        ),
        min_entries=2,
        max_entries=2,
    )


class DetectedFaceForm(Form):
    bbox = FormField(BBoxForm, label="bbox")
    landmarks = FormField(LandmarkForm, label="landmarks")
    confidence = FloatField(
        "confidence",
        validators=[
            DataRequired(message="Vui lòng nhập độ tin cậy"),
            NumberRange(
                min=0, max=1, message="Độ tin cậy phải nằm trong khoảng từ 0 đến 1"
            ),
        ],
    )


class RecognizeForm(FlaskForm):
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
    model = StringField(
        "model",
        validators=[
            DataRequired(
                message="Vui lòng chọn model. Các model hiện có: 'sface', 'arcface'"
            ),
            Regexp(
                "^(sface|arcface)$",
                message="Model không hợp lệ. Các model hiện có: 'sface', 'arcface'",
            ),
        ],
    )
