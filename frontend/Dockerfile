FROM node:lts-alpine as builder
WORKDIR /chat

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine
WORKDIR /chat

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

ENV PORT=4000
EXPOSE 4000

COPY --from=builder /chat/build .
CMD node index.js