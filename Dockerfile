FROM node:14.21-bullseye

WORKDIR /tab-extension

COPY *.js .

RUN npm i

ENTRYPOINT [ "node api.js" ]