FROM node:20.0-alpine as dependencies

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

FROM dependencies as builder

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM dependencies as deploy
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000
CMD ["yarn", "serve", "-s", "dist"]
