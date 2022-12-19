FROM node:16-slim

WORKDIR /app/frontend

COPY package.json /app/frontend/

RUN npm install
RUN npm install -g serve

COPY . /app/frontend/

ENV API_URL=http://localhost:5000

EXPOSE 3000

RUN npm run build

CMD ["serve", "-l", "3000", "-s", "build"]