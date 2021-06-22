FROM node:14-alpine3.12

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .


CMD [ "node", "server.js" ]