FROM node:16 as builder
#FROM --platform=linux/amd64 node:16-alpine3.16 as builder
WORKDIR /app
COPY package.json ./
RUN npm install --force
COPY . .
RUN npm run build


FROM node:16
#FROM --platform=linux/amd64 node:18

WORKDIR /build

COPY --from=builder /app/build .

RUN npm i -g serve

EXPOSE 3000
ENTRYPOINT ["serve", "-s"]