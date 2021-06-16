FROM node:lts-alpine

WORKDIR /chat

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build:ts

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=4s --start-period=1s CMD wget -nv -t1 --spider 'http://localhost:3000/status' || exit 1
CMD node dist/index.js