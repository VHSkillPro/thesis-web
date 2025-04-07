import json
import numpy as np
from PIL import Image
from http import HTTPStatus
from flask import Blueprint, Response
from lib.face_detector.base import BaseFaceDetector
from lib.face_detector.retinaface import RetinaFaceDetector
from lib.face_detector.yunet import YuNetDetector
from modules.detection.form import DetectFaceForm, DetectSingleFaceForm
from werkzeug.datastructures import FileStorage

bp = Blueprint("face_detect", __name__)
model_detection: dict[str, BaseFaceDetector] = {
    "yunet": YuNetDetector(),
    "retinaface": RetinaFaceDetector(),
}


@bp.route("/", methods=["POST"])
def detect_faces():
    form = DetectFaceForm(meta={"csrf": False})

    if not form.validate_on_submit():
        return {"error": form.errors}, 400

    threshold = form.threshold.data
    model_name = form.model.data
    if threshold is not None and threshold > 0 and threshold < 1:
        model_detection[model_name].set_confidence_threshold(threshold)
    else:
        model_detection[model_name].set_confidence_threshold(
            0.8 if model_name == "yunet" else 0.5
        )

    image: FileStorage = form.image.data
    pil_image = Image.open(image.stream)
    cv_image = np.array(pil_image)
    cv_image = cv_image[:, :, ::-1].copy()

    faces = model_detection[model_name].detect(cv_image)

    return Response(
        json.dumps(
            {
                "faces": [face.to_dict() for face in faces],
                "meta": {
                    "image_width": cv_image.shape[1],
                    "image_height": cv_image.shape[0],
                    "face_count": len(faces),
                },
                "message": "Phát hiện khuôn mặt thành công",
            }
        ),
        status=HTTPStatus.OK,
    )


@bp.route("/single", methods=["POST"])
def detect_single_face():
    form = DetectSingleFaceForm(meta={"csrf": False})

    if not form.validate_on_submit():
        return {"error": form.errors}, 400

    threshold = form.threshold.data
    if threshold is not None and threshold > 0 and threshold < 1:
        model_detection["yunet"].set_confidence_threshold(threshold)
    else:
        model_detection["yunet"].set_confidence_threshold(0.8)

    image: FileStorage = form.image.data
    pil_image = Image.open(image.stream)
    cv_image = np.array(pil_image)
    cv_image = cv_image[:, :, ::-1].copy()

    face, scale = model_detection["yunet"].detect_single_multiscale(cv_image)

    if face is None:
        return Response(
            json.dumps(
                {
                    "message": "Không phát hiện khuôn mặt nào",
                    "meta": {
                        "image_width": cv_image.shape[1],
                        "image_height": cv_image.shape[0],
                    },
                }
            ),
            status=HTTPStatus.NOT_FOUND,
        )

    return Response(
        json.dumps(
            {
                "face": face.to_dict(),
                "meta": {
                    "image_width": cv_image.shape[1],
                    "image_height": cv_image.shape[0],
                    "scale": float(scale),
                },
                "message": "Phát hiện khuôn mặt thành công",
            }
        ),
        status=HTTPStatus.OK,
    )
