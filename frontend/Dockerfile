# Step 1: Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run setup:typesense
CMD ["npm", "run", "dev"]