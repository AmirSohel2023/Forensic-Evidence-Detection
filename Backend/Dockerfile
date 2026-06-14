FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir flask flask-cors gunicorn werkzeug
RUN pip install --no-cache-dir opencv-python-headless
RUN pip install --no-cache-dir ultralytics --no-deps
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir numpy pillow pyyaml tqdm scipy psutil py-cpuinfo requests pandas matplotlib seaborn

COPY . .

EXPOSE 8080

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080"]