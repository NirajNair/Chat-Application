FROM node:16-slim

WORKDIR /app/server

COPY package.json /app/server

RUN npm install
RUN npm install -g nodemon

COPY . /app/server

EXPOSE 5000

CMD ["nodemon", "app.js"]