const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const upload = require("../multer/multer.config");
const cloudinary = require("../cloudinary/cloudinary.config");
const fs = require("fs");

const chatRouter = express.Router();

// get list of friends
chatRouter.get("/friendList", authenticate, async (req, res) => {
    try {
        let friendList = [];
        let chats = await Chat.find({
            $and: [{ groupChat: false }, { users: req.session.user._id }],
        }).populate("users", "-password");
        chats.map((chat) => {
            friendList.push(
                chat.users[0]._id.toString() === req.session.user._id
                    ? chat.users[1]
                    : chat.users[0]
            );
        });
        res.status(200).send(friendList);
    } catch (e) {
        console.log(e);
    }
});

// search Friend
chatRouter.get("/friend", authenticate, async (req, res) => {
    try {
        const friendKeyword = req.query.search;
        console.log("search param: ", friendKeyword);
        if (friendKeyword == "") {
            res.status(200).send([]);
        } else {
            await Chat.find({
                users: req.session.user._id,
            }).exec(async function (err, result) {
                if (err) return res.status(401).send({ msg: err });
                // console.log("result: " ,result);
                await User.find({
                    $and: [
                        {
                            $or: [
                                {
                                    firstName: {
                                        $regex: friendKeyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    lastName: {
                                        $regex: friendKeyword,
                                        $options: "i",
                                    },
                                },
                            ],
                        },
                        { _id: { $ne: req.session.user._id } },
                    ],
                }).exec(function (err, result) {
                    if (err) return res.status(401).send({ msg: err });
                    console.log(result);
                    res.status(200).send(result);
                });
            });
        }
    } catch (err) {
        console.log(error);
    }
});

// check chat exists
async function checkChatExists(userIds) {
    const chat = await Chat.findOne({
        users: userIds,
    });
    console.log("Chat exists: ", chat);
    if (chat) {
        return true;
    }
    return false;
}

// add friend
chatRouter.post("/addfriend", authenticate, async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({
            email: req.body.email.toLowerCase(),
        });
        console.log(user);
        if (user) {
            let userIds = [req.session.user._id, user._id];
            // console.log(userIds, await checkChatExists(userIds));
            let doesChatExist = await checkChatExists(userIds);
            if (!doesChatExist) {
                const newChatData = {
                    chatname: user.firstName + " " + user.lastName,
                    users: [req.session.user._id, user._id],
                    groupChat: false,
                };
                const newChat = await Chat.create(newChatData);

                const populatedNewChat = await Chat.findOne({
                    _id: newChat._id,
                }).populate("users", "-password");
                console.log("Created chat");
                res.status(200).json({
                    msg: "User Added!",
                    chatDetails: populatedNewChat,
                });
            } else {
                res.status(401).json({
                    msg: "Could not add user as user is already added!",
                });
            }
        } else {
            res.status(401).json({ msg: "Could not add user." });
        }
    } catch (err) {
        res.status(401).send("Could not add friend");
    }
});

// get all chats
chatRouter.get("/", authenticate, async (req, res) => {
    allChats = await Chat.find({
        users: { $eq: req.session.user._id },
    })
        .populate("users", "-password")
        .populate("lastMessage", "-chat")
        .populate("lastMessage.sender", "-password")
        .populate("groupAdmin", "firstName lastName pic");

    await Message.populate(allChats, {
        path: "lastMessage.sender",
        select: "firstName lastName",
    });

    allChats.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    res.status(200).send(allChats);
});

// creates a new group
chatRouter.post(
    "/creategroup",
    authenticate,
    upload.single("pic"),
    async (req, res) => {
        console.log(req.body);
        const { groupName, users } = req.body;
        // users.push(req.session.user._id);
        try {
            let usersList = users.split(",");
            const newGroupChatData = {
                chatName: groupName,
                users: usersList,
                groupChat: true,
                groupAdmin: req.session.user._id,
            };
            if (req.file) {
                await cloudinary.uploader
                .upload(req.file.path)
                .then((result) => {
                    console.log(result);
                    newGroupChatData["groupPic"] = result.url;
                    newGroupChatData["groupPicId"] = result.public_id;
                    fs.unlinkSync(req.file.path);
                });
                console.log(newGroupChatData);
                const newGroupChat = await Chat.create(newGroupChatData);

                const populatedNewGroupChat = await Chat.findOne({
                    _id: newGroupChat._id,
                })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("lastMessage");
                console.log(populatedNewGroupChat);
                res.status(200).send(populatedNewGroupChat);
            }
        } catch (err) {
            console.log(err);
            res.status(401).send("Could not add friend");
        }
    }
);

// updates group detail
chatRouter.post("/updategroup", authenticate, async (req, res) => {
    const { chatId, chatName, users } = req.body.group;
    console.log(req.body);
    console.log(chatId, "update");

    const updatedChat = await Chat.updateOne(
        { _id: chatId },
        {
            $set: {
                chatName: chatName,
                users: users,
            },
        }
    );
    console.log(updatedChat);
    if (!updatedChat) {
        res.status(404).send("Chat not found");
    } else {
        res.status(200).send(updatedChat);
    }
});

// removes a user from a group / leaving group
chatRouter.post("/leavegroup", authenticate, async (req, res) => {
    const { chatId, userId } = req.body.userDetail;
    //check if user is groupadmin
    const removedUser = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    ).populate("users", "-password");
    if (!removedUser) {
        res.status(404).send("Chat not found");
    } else {
        res.status(200).send("User removed from group");
    }
});

chatRouter.post("/deletegroup/", authenticate, async (req, res) => {
    try {
        const {chat} = req.body;
        await cloudinary.uploader.destroy(chat.groupPicId);
        await Chat.deleteOne({ _id: chat._id });
        await Message.deleteMany({ chat: chat._id });

        res.status(200).send({ msg: "Group Deleted" });
    } catch (e) {
        res.status(200).send({ msg: "Could not delete group" });
    }
});

module.exports = chatRouter;
