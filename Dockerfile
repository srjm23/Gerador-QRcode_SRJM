FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production
COPY backend/server.js ./backend/

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-builder /app/backend ./backend
COPY frontend/ ./frontend
EXPOSE 3000
CMD ["node", "backend/server.js"]
