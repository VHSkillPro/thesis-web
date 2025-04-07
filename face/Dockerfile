FROM --platform=$BUILDPLATFORM python:3.12.9-slim AS builder

RUN apt-get update && apt-get install -y \
  build-essential \
  cmake \
  git \
  curl \
  libgtk2.0-dev \
  libglib2.0-0 \
  libsm6 \
  libxrender1 \
  libxext6 \
  libgl1-mesa-glx \
  libglib2.0-dev \
  libatlas-base-dev \
  libavcodec-dev \
  libavformat-dev \
  libswscale-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/face

COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
  pip3 install -r requirements.txt

COPY . .

CMD ["flask", "run", "--debug", "--host=0.0.0.0"]