FROM node:16-slim

WORKDIR /app/server

COPY package.json /app/server

RUN npm install
RUN npm install -g nodemon

COPY . /app/server

ENV CLOUDINARY_CLOUD_NAME=dgmwfmymy
ENV CCLOUDINARY_API_KEY=361471573367131
ENV CLOUDINARY_API_SECRET=qInRAVuFkJKXThJiJqYYEGag4-Y
ENV MONGO_URI=mongodb+srv://dexter:dexter123@videochat.m2fg0kl.mongodb.net/?retryWrites=true&w=majority
ENV PORT=5000
ENV SECRET=thisisnotasecret
ENV API_URL=http://localhost:5000
ENV CLIENT_URL=http://localhost:3000

EXPOSE 5000

CMD ["nodemon", "app.js"]