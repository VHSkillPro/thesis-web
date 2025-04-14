from http import HTTPStatus
import json
import numpy as np
from PIL import Image
from werkzeug.datastructures import FileStorage
from flask import Blueprint, Response, current_app, request
from lib.face_recognizer.base import BaseFaceRecognizer
from lib.entities.face import DetectedFace
from modules.recognize.utils import check_detected_faces_data
from lib.face_recognizer.arcface import ArcFaceRecognizer
from lib.face_recognizer.sface import SFaceRecognizer
from modules.recognize.form import RecognizeForm


bp = Blueprint("recognize", __name__)
model_recognition: dict[str, BaseFaceRecognizer] = {
    "sface": SFaceRecognizer(),
    "arcface": ArcFaceRecognizer(),
}


@bp.route("/", methods=["POST"])
def recognize_faces():
    faces_status, faces_data = check_detected_faces_data(request.form.get("faces"))
    form = RecognizeForm(meta={"csrf": False})

    if not form.validate_on_submit() or not faces_status:
        form_errors = form.errors
        if not faces_status:
            form_errors["faces"] = faces_data
            current_app.logger.info(faces_data)
        return {"error": form_errors}, 400

    image: FileStorage = form.image.data
    pil_image = Image.open(image.stream)
    cv_image = np.array(pil_image)
    cv_image = cv_image[:, :, ::-1].copy()

    embeddings = []
    for face in faces_data:
        detected_face = DetectedFace(
            bbox=face["bbox"],
            landmarks=face["landmarks"],
            confidence=face["confidence"],
        )

        embedding = (
            model_recognition[form.model.data].infer(cv_image, detected_face).tolist()
        )
        embeddings.append(embedding if form.model.data == "arcface" else embedding[0])

    return Response(
        json.dumps(
            {
                "embeddings": embeddings,
                "meta": {
                    "image_width": cv_image.shape[1],
                    "image_height": cv_image.shape[0],
                    "face_count": len(embeddings),
                    "size": len(embeddings[0]),
                },
                "message": "Trích xuất đặc trưng khuôn mặt thành công",
            }
        ),
        status=HTTPStatus.OK,
    )
