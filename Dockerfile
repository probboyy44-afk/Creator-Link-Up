# Creator Link Up — container image for any host (Render, Railway, Fly.io, VPS)
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source and build the static bundle
COPY . .
RUN npm run build:static

# Runtime: serve the Hono app via the Node server entry
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "--import", "tsx", "server.mjs"]
