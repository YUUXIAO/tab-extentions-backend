FROM node:14.21-bullseye

WORKDIR /tab-extension

COPY ./*.js .
COPY package.json .

RUN npm i

ENTRYPOINT [ "node api.js" ]