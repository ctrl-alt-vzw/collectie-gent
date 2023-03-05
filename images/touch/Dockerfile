FROM node:17.2.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm i --silent

COPY ./ ./

CMD ["npm", "run", "start"]