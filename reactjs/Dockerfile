FROM node:23-alpine

WORKDIR /app

COPY stock_dashboard/package*.json .

RUN npm install

COPY stock_dashboard .

CMD ["npm", "start"]