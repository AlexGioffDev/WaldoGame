FROM node:26-alpine3.23
WORKDIR /app

COPY package*.json .
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts .

RUN npx prisma generate

COPY . .
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
