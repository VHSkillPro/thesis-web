from typing import TypedDict


class Bbox(TypedDict):
    x: float
    y: float
    w: float
    h: float


class Landmarks(TypedDict):
    left_eye: tuple[float, float]
    right_eye: tuple[float, float]
    nose: tuple[float, float]
    left_mouth: tuple[float, float]
    right_mouth: tuple[float, float]


class DetectedFace:
    def __init__(
        self, bbox: Bbox, landmarks: Landmarks | None = None, confidence: float = None
    ):
        self.bbox = bbox
        self.landmarks = landmarks
        self.confidence = confidence

    def __str__(self):
        return "DetectedFace(bbox={}, landmarks={}, confidence={})".format(
            self.bbox, self.landmarks, self.confidence
        )

    def to_dict(self):
        return {
            "bbox": {
                "x": float(self.bbox["x"]),
                "y": float(self.bbox["y"]),
                "w": float(self.bbox["w"]),
                "h": float(self.bbox["h"]),
            },
            "landmarks": {
                "left_eye": [
                    float(self.landmarks["left_eye"][0]),
                    float(self.landmarks["left_eye"][1]),
                ],
                "right_eye": [
                    float(self.landmarks["right_eye"][0]),
                    float(self.landmarks["right_eye"][1]),
                ],
                "nose": [
                    float(self.landmarks["nose"][0]),
                    float(self.landmarks["nose"][1]),
                ],
                "left_mouth": [
                    float(self.landmarks["left_mouth"][0]),
                    float(self.landmarks["left_mouth"][1]),
                ],
                "right_mouth": [
                    float(self.landmarks["right_mouth"][0]),
                    float(self.landmarks["right_mouth"][1]),
                ],
            },
            "confidence": float(self.confidence),
        }
