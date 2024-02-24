FROM node:14.21-bullseye

WORKDIR /tab-extension

COPY *.js .
COPY package.json .

RUN npm config set registry https://registry.npmmirror.com && \
  npm i

ENTRYPOINT [ "node api.js" ]