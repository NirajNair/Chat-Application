FROM node:16-slim

WORKDIR /app/frontend

COPY package.json /app/frontend/

RUN npm install
RUN npm install -g serve

COPY . /app/frontend/

EXPOSE 3000

RUN npm run build

CMD ["serve", "-l", "3000", "-s", "build"]