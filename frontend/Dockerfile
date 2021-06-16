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
HEALTHCHECK --interval=20s --timeout=4s --start-period=1s CMD wget -nv -t1 --spider 'http://localhost:4000/' || exit 1
CMD node index.js