FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY ./requirements_v1.txt $pwd

RUN pip install --upgrade pip
RUN pip install -r requirements_v1.txt

COPY ./v1 /app/app