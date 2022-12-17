const express = require("express");
const mongoose = require("mongoose");
const uuid = require("uuid").v4;
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const session = require("express-session");
const redisStore = require("connect-redis")(session);
const connectMongoose = require("./db/db");
const { createServer } = require("http");
const { Server } = require("socket.io");


dotenv.config();
const app = express();
const httpServer = createServer(app);
const port = process.env.PORT;
//url: 'redis://redis:6379'
const client = redis.createClient({legacyMode: true, });

connectMongoose();

client.on("error", (err) => {
    console.log("Redis error: ", err);
});

client.connect();
client.on('connect', () => {
    console.log('Redis client connected.');
});

const io = require("socket.io")(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",

    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io!")

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: ", room);
    })

    socket.on("new message", (newMessage) => {
        let chat = newMessage.chat;
        if(!chat.users) return console.log("chat.users not defined");
        
        chat.users.forEach(user => {
            if(user._id === newMessage.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessage);
        });
    })
});

app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
      credentials: true,
    })
  );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // for application/x-www-form-urlencoded

// app.use(session({
//     secret: 'ssshhhhh',
//     store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
//     saveUninitialized: false,
//     resave: false
// }));

app.use(
    session({
        genid: (req) => {
            return uuid();
        },
        store: new redisStore({
            host: "localhost",
            port: 6379,
            client: client,
            ttl: 260,
        }),
        secret: process.env.SECRET,
        name: "_sessionId",
        cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24, sameSite: 'Lax', httpOnly: true, }, // 86400000
        saveUninitialized: true,
        resave: false,
    })
);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

httpServer.listen(port, () => console.log(`App is listening to port ${port}`));


