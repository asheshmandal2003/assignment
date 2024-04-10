FROM node:18.19.1-alpine3.18

WORKDIR /app/server

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]