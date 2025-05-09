FROM node:24.0-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000


FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build


FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
RUN npm ci
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
CMD ["npm", "start"]


FROM base AS dev
ENV NODE_ENV=development
RUN npm install 
COPY . .
CMD ["npm", "run", "dev"]