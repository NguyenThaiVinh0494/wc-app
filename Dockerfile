# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the Express backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy root configurations
COPY package*.json ./

# Copy built frontend assets
COPY --from=frontend-builder /app/dist ./dist

# Copy built backend and its dependencies
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/package*.json ./server/

# Install only production dependencies for the backend
WORKDIR /app/server
RUN npm install --only=production

# Revert to root workdir for execution
WORKDIR /app

EXPOSE 3000

CMD ["node", "server/dist/server.js"]
