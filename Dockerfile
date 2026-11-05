FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV APP_ENV=production
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production
ENV APP_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY server.js next.config.mjs ./
EXPOSE 3000
CMD ["node", "server.js"]