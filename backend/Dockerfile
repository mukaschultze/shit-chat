FROM node:lts-alpine

WORKDIR /chat

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build:ts

EXPOSE 3000

CMD node dist/index.js