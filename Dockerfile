FROM node:14.21-bullseye

WORKDIR /tab-extension

COPY *.js .
COPY package.json .

ENV DB_PATH=db

RUN npm config set registry https://registry.npmmirror.com && \
  npm i

ENTRYPOINT [ "node", "api.js" ]