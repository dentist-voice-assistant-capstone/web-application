FROM continuumio/miniconda3

WORKDIR /usr/src/app

COPY . .

RUN pip install -r requirements.txt

# download Token Classification model
RUN pip install gdown
RUN gdown 15xjAegzT-AWGlyqgguPssP_tu7-0CQw6 -O ./model/onnx_model-quantized.onnx

EXPOSE 50052

CMD ["python", "server.py"]