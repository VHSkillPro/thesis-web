import json
from modules.recognize.form import DetectedFaceForm


def check_detected_faces_data(faces_text: str | None):
    """
    Validates and processes a JSON string containing a list of detected face data.

    Args:
        faces_text (str | None): A JSON string representing a list of face data, or None.

    Returns:
        tuple:
            - bool: Indicates whether the validation was successful.
            - list: If validation fails, contains error messages as strings.
                    If validation succeeds, contains the processed list of face data.

    Raises:
        json.JSONDecodeError: If the input string is not valid JSON.

    Notes:
        - The input JSON string must represent a list of dictionaries.
        - Each dictionary in the list is validated using the `DetectedFaceForm` class.
        - If the input is None, an error message is returned indicating that the face list is required.
        - If the input is not a list, empty, or contains invalid data, appropriate error messages are returned.
    """
    if faces_text is None:
        return False, ["Vui lòng nhập danh sách khuôn mặt cần trích xuất"]

    try:
        faces_json = json.loads(faces_text)
    except json.JSONDecodeError:
        return False, ["Dữ liệu không hợp lệ"]

    if not isinstance(faces_json, list):
        return False, ["Dữ liệu không hợp lệ"]

    if len(faces_json) == 0:
        return False, ["Danh sách khuôn mặt không được để trống"]

    faces_form = []
    for face in faces_json:
        if not isinstance(face, dict):
            return False, ["Dữ liệu không hợp lệ"]

        face_form = DetectedFaceForm(data=face)
        if not face_form.validate():
            return False, face_form.errors

        faces_form.append(face_form.data)

    return True, faces_form
