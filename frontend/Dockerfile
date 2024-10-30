# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Set the environment variable at build time
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN npm run build

# Production image, copy only necessary files
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV production

# Copy package.json and install production dependencies
COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy built application files
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.mjs ./

# Expose the frontend port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
