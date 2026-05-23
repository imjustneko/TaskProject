FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx tsc -p tsconfig.build.json

EXPOSE 3001

CMD npx prisma migrate deploy && node dist/main
