# Production Container Specification
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json ./

# Install dependencies if present
RUN npm install --production --silent

# Copy application source code
COPY . .

# Expose standard web service port
EXPOSE 80

# Environment variables
ENV PORT=80
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start server
CMD ["node", "app.js"]
