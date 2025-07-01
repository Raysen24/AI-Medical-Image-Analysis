# FROM python:3.6.7-alpine
FROM python:3.10

# ENV PYTHONUNBUFFERED 1
# RUN apk update && \
#     apk add --virtual build-deps gcc python-dev musl-dev libffi-dev && \
#     apk add postgresql-dev

# RUN apt update -y && \
#     apt install build-essential python-dev musl-dev libffi-dev -y  && \
#     apt install postgresql-dev  -y   

RUN apt update -y && apt install -y netcat-openbsd

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN python -m pip install pip==21.2.2
RUN pip install -r requirements.txt
ADD ./ /code/
RUN chmod +x /code/backendapp/wait-for.sh
RUN chmod +x /code/backendapp/run.sh
WORKDIR /code/backendapp

# CMD python -m http.server