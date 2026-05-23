FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install && chmod -R +x node_modules/.bin

COPY . .

RUN node node_modules/prisma/build/index.js generate
RUN node node_modules/typescript/bin/tsc -p tsconfig.build.json

EXPOSE 3001

CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node dist/main"]
