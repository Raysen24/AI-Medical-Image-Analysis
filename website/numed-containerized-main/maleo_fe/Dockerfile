FROM node:14.18.2

RUN mkdir /code
WORKDIR /code

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --legacy-peer-deps

ADD . /code

# RUN npm ci

COPY ./entryPoint.sh /
RUN chmod +x /entryPoint.sh

ENTRYPOINT ["/entryPoint.sh"]

CMD npm run start

# FROM node:14.18.2 as builder

# RUN mkdir /app
# WORKDIR /app

# ADD . /app

# RUN npm ci
# RUN npm run build

# FROM nginx:1.19
