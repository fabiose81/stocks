FROM node

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npx tsc

CMD [ "node", "dist/app.js" ]