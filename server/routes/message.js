const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const Message = require('../models/message.model');
const Chat = require('../models/chat.model');
const User = require('../models/user.model');

const messageRouter = express.Router();

// api route to send message
messageRouter.post("/send", authenticate, async (req, res) => {
    const { msg, chatId } = req.body.messageBody;
    if(!msg || !chatId) {
        res.status(400).send({msg: "Incomplete data sent."})
    }   
    let newMessageObj = {
        sender: req.session.user._id,
        msg: msg,
        chat: chatId
    }
    try {
        let message = await Message.create(newMessageObj);
        message = await message.populate("sender", "firstName lastName pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "firstName lastName pic email"
        });
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: message
        });
        // console.log(message);

        res.status(200).send(message);
    } catch(err) {
        console.log(err);
    }
});

// api route to get all messages of a particular chat
messageRouter.get("/:chatId", authenticate, async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        // .sort({createdAt: -1})
        .populate("sender", "firstName lastName pic email");
        
        res.status(200).send(messages);

    } catch(err) {
        res.status(400).send({msg: "Could not fetch all chat."});
        console.log(err);
    }
});

// delete text messages of a chat 
messageRouter.get("/deletechat/:chatId", authenticate, async (req, res) => {
    try {
        await Message.deleteMany({ chat: req.params.chatId });
        res.status(200).send({msg: "Could not delete Chats."});
    } catch(err) {
        res.status(400).send({msg: "Could not delete Chats."});
        console.log(err);
    }
})

module.exports = messageRouter