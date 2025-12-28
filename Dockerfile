# Stage 1: Build the Client
FROM node:20-slim AS client-builder

WORKDIR /app/client

# Copy Client package.json and config
COPY client/package*.json ./
COPY client/tsconfig*.json ./
COPY client/vite.config.ts ./
COPY client/index.html ./
COPY client/tailwind.config.js ./
COPY client/postcss.config.js ./

# Install dependencies
RUN npm install

# Copy Client source code
COPY client/src ./src

# Build static assets (output to /app/client/dist)
RUN npm run build


# Stage 2: Production Server
FROM node:20-slim

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy Server package.json
COPY server/package*.json ./server/

# Install Server dependencies (production only)
WORKDIR /app/server
RUN npm install --omit=dev

# Copy Server source code
COPY server/index.js ./
COPY server/game ./game

# Copy Built Client Assets from Stage 1 to server's static folder
# We'll put them in a 'client/dist' folder relative to /app, 
# so 'path.join(__dirname, "../client/dist")' works if __dirname is /app/server
WORKDIR /app
COPY --from=client-builder /app/client/dist ./client/dist

# Expose Port
EXPOSE 3000

# Start Server
WORKDIR /app/server
CMD ["node", "index.js"]
