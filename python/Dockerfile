FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requeriments.txt .

RUN pip install --upgrade pip
RUN pip install -r requeriments.txt

COPY . .

CMD ["python", "stock_analyse/kafka/consumer.py"]