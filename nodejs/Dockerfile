FROM node

WORKDIR /home/node/app

COPY stock_collect/package*.json ./
COPY stock_collect/tsconfig.json ./

RUN npm install

COPY . .

RUN npx tsc

CMD [ "node", "dist/app.js" ]