FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY server.js ./

EXPOSE 6000

CMD ["node", "server.js"]