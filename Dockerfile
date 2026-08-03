FROM cgr.dev/chainguard/node:latest

ENV NODE_ENV=production

WORKDIR /app/backend

COPY --chown=65532:65532 backend/package*.json ./

RUN npm ci --omit=dev

COPY --chown=65532:65532 backend/server.js ./

WORKDIR /app

COPY --chown=65532:65532 frontend/ ./frontend/

EXPOSE 3000

CMD ["backend/server.js"]