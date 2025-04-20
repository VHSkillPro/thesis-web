import json, cv2
import numpy as np
from http import HTTPStatus
from PIL import Image, ImageOps
from flask import Blueprint, Response, current_app
from lib.face_recognizer.base import BaseFaceRecognizer
from lib.face_detector.base import BaseFaceDetector
from lib.face_recognizer.arcface import ArcFaceRecognizer
from lib.face_recognizer.sface import SFaceRecognizer
from lib.face_detector.retinaface import RetinaFaceDetector
from lib.face_detector.yunet import YuNetDetector
from modules.verification.form import VerificationForm

bp = Blueprint("verification", __name__)
model_detection: dict[str, BaseFaceDetector] = {
    "yunet": YuNetDetector(),
    "retinaface": RetinaFaceDetector(),
}
model_recognition: dict[str, BaseFaceRecognizer] = {
    "sface": SFaceRecognizer(),
    "arcface": ArcFaceRecognizer(),
}


@bp.route("/", methods=["POST"])
def verify():
    form = VerificationForm()
    if not form.validate_on_submit():
        return Response(
            json.dumps({"errors": form.errors, "message": "Dữ liệu không hợp lệ"}),
            status=HTTPStatus.BAD_REQUEST,
        )

    # Convert to OpenCV image
    pil_image_1 = Image.open(form.image_1.data.stream)
    pil_image_2 = Image.open(form.image_2.data.stream)

    pil_image_1 = ImageOps.exif_transpose(pil_image_1)
    pil_image_2 = ImageOps.exif_transpose(pil_image_2)

    cv_image_1 = np.array(pil_image_1)
    cv_image_2 = np.array(pil_image_2)

    image_1 = cv_image_1[:, :, ::-1].copy()
    image_2 = cv_image_2[:, :, ::-1].copy()

    # Detect face in images
    model_det_name, model_rec_name = form.pipeline.data.split("+")

    detected_face_1 = None
    detected_face_2 = None

    if model_det_name == "yunet":
        detected_face_1, scale_1 = model_detection[
            model_det_name
        ].detect_single_multiscale(image_1)

        if detected_face_1 is None:
            return Response(
                json.dumps(
                    {
                        "errors": {"image_1": ["Ảnh không hợp lệ"]},
                        "message": "Dữ liệu không hợp lệ",
                    }
                ),
                status=HTTPStatus.BAD_REQUEST,
            )

        h_1, w_1 = image_1.shape[:2]
        image_1 = cv2.resize(image_1, (int(w_1 * scale_1), int(h_1 * scale_1)))

        detected_face_2, scale_2 = model_detection[
            model_det_name
        ].detect_single_multiscale(image_2)

        if detected_face_2 is None:
            return Response(
                json.dumps(
                    {
                        "errors": {"image_2": ["Ảnh không hợp lệ"]},
                        "message": "Dữ liệu không hợp lệ",
                    }
                ),
                status=HTTPStatus.BAD_REQUEST,
            )

        h_2, w_2 = image_2.shape[:2]
        image_2 = cv2.resize(image_2, (int(w_2 * scale_2), int(h_2 * scale_2)))
    else:
        detected_face_1 = model_detection[model_det_name].detect(image_1)
        if len(detected_face_1) != 1:
            return Response(
                json.dumps(
                    {
                        "errors": {"image_1": ["Ảnh không hợp lệ"]},
                        "message": "Dữ liệu không hợp lệ",
                    }
                ),
                status=HTTPStatus.BAD_REQUEST,
            )
        detected_face_1 = detected_face_1[0]

        detected_face_2 = model_detection[model_det_name].detect(image_2)
        if len(detected_face_2) != 1:
            return Response(
                json.dumps(
                    {
                        "errors": {"image_2": ["Ảnh không hợp lệ"]},
                        "message": "Dữ liệu không hợp lệ",
                    }
                ),
                status=HTTPStatus.BAD_REQUEST,
            )
        detected_face_2 = detected_face_2[0]

    # Get similarity of faces
    embedding_1 = model_recognition[model_rec_name].infer(image_1, detected_face_1)
    embedding_2 = model_recognition[model_rec_name].infer(image_2, detected_face_2)
    similarity = model_recognition[model_rec_name].similarity(embedding_1, embedding_2)

    return Response(
        json.dumps(
            {
                "similarity": float(similarity),
                "embedding": {
                    "image_1": (
                        embedding_1.tolist()
                        if model_rec_name == "arcface"
                        else embedding_1.tolist()[0]
                    ),
                    "image_2": (
                        embedding_2.tolist()
                        if model_rec_name == "arcface"
                        else embedding_2.tolist()[0]
                    ),
                },
                "meta": {
                    "model_detection": model_det_name,
                    "model_recognition": model_rec_name,
                },
                "message": "Tính toán thành công",
            }
        ),
        status=HTTPStatus.OK,
    )
