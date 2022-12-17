FROM node:16-slim

WORKDIR /app/frontend

COPY package.json /app/frontend/

RUN npm install

COPY . /app/frontend/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]