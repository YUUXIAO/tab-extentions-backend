FROM node:14.21-bullseye

RUN npm i

ENTRYPOINT [ "node api.js" ]