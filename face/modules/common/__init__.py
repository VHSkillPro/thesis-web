import json
import cv2
import numpy as np
from http import HTTPStatus
from PIL import Image, ImageOps
from flask import Blueprint, Response
from lib.face_detector.retinaface import RetinaFaceDetector
from lib.face_detector.yunet import YuNetDetector
from lib.face_recognizer.arcface import ArcFaceRecognizer
from lib.face_recognizer.base import BaseFaceRecognizer
from lib.face_recognizer.sface import SFaceRecognizer
from lib.face_detector.base import BaseFaceDetector
from modules.common.form import GetForm

bp = Blueprint("common", __name__)
model_detection: dict[str, BaseFaceDetector] = {
    "yunet": YuNetDetector(),
    "retinaface": RetinaFaceDetector(),
}
model_recognition: dict[str, BaseFaceRecognizer] = {
    "sface": SFaceRecognizer(),
    "arcface": ArcFaceRecognizer(),
}


@bp.route("/get", methods=["POST"])
def get():
    form = GetForm()
    if not form.validate_on_submit():
        return Response(
            json.dumps({"errors": form.errors, "message": "Dữ liệu không hợp lệ"}),
            status=HTTPStatus.BAD_REQUEST,
        )

    pil_image = Image.open(form.image.data.stream)
    pil_image = ImageOps.exif_transpose(pil_image)
    cv_image = np.array(pil_image)
    image = cv_image[:, :, ::-1].copy()

    model_det_name, model_rec_name = form.pipeline.data.split("+")

    detected_faces = model_detection[model_det_name].detect(image)
    embeddings = [
        model_recognition[model_rec_name].infer(image, detected_face).tolist()
        for detected_face in detected_faces
    ]

    if len(embeddings) > 0 and model_rec_name == "sface":
        embeddings = [embedding[0] for embedding in embeddings]

    faces = [detected_face.to_dict() for detected_face in detected_faces]
    for face, embedding in zip(faces, embeddings):
        face["embedding"] = embedding

    return Response(
        json.dumps(
            {
                "faces": faces,
                "meta": {
                    "face_count": len(embeddings),
                    "size": len(embeddings[0]) if len(embeddings) > 0 else 0,
                },
                "message": "Phát hiện và trích xuất thành công",
            }
        ),
        status=HTTPStatus.OK,
    )


@bp.route("/get_single", methods=["POST"])
def get_single():
    form = GetForm()
    if not form.validate_on_submit():
        return Response(
            json.dumps({"errors": form.errors, "message": "Dữ liệu không hợp lệ"}),
            status=HTTPStatus.BAD_REQUEST,
        )

    pil_image = Image.open(form.image.data.stream)
    pil_image = ImageOps.exif_transpose(pil_image)
    cv_image = np.array(pil_image)
    image = cv_image[:, :, ::-1].copy()

    model_det_name, model_rec_name = form.pipeline.data.split("+")

    detected_face = None
    if model_det_name == "yunet":
        detected_face, scale = model_detection[model_det_name].detect_single_multiscale(
            image
        )
        if detected_face is None:
            return Response(
                json.dumps(
                    {
                        "errors": {
                            "image": [
                                "Không tìm thấy khuôn mặt hoặc tìm thấy nhiều khuôn mặt"
                            ],
                        },
                        "message": "Dữ liệu không hợp lệ",
                    }
                ),
                status=HTTPStatus.BAD_REQUEST,
            )

        h, w = image.shape[:2]
        image = cv2.resize(image, (int(w * scale), int(h * scale)))
    else:
        detected_face = model_detection[model_det_name].detect(image)
        if len(detected_face) != 1:
            return Response(
                json.dumps(
                    {
                        "errors": {
                            "image": [
                                "Không tìm thấy khuôn mặt hoặc tìm thấy nhiều khuôn mặt"
                            ],
                        },
                        "message": "Dữ liệu không hợp lệ",
                    }
                ),
                status=HTTPStatus.BAD_REQUEST,
            )

        detected_face = detected_face[0]

    embedding = model_recognition[model_rec_name].infer(image, detected_face).tolist()
    if model_rec_name == "sface":
        embedding = embedding[0]

    face = detected_face.to_dict()
    face["embedding"] = embedding

    return Response(
        json.dumps(
            {
                "face": face,
                "meta": {
                    "face_count": 1,
                    "size": len(embedding),
                },
                "message": "Phát hiện và trích xuất thành công",
            }
        ),
        status=HTTPStatus.OK,
    )
