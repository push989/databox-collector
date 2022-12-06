FROM node:18.12.1 as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm ci
COPY . .
RUN npm run compile

FROM node:18.12.1-bullseye-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=builder /usr/src/app/dist/src ./dist
# Only copied for demo log data
COPY --from=builder /usr/src/app/logs ./

EXPOSE 3000
CMD [ "node", "dist/index.js" ]