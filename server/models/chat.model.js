const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
        groupChat: { type: Boolean, default: false },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        groupPic: {
            type: String,
            required: true,
            default: "https://res.cloudinary.com/dgmwfmymy/image/upload/v1671195591/defaultgroupavatar_2_bpmtd1.png"
        },
        groupPicId: {
            type: String,
            required: true,
            default: "defaultgroupavatar_2_bpmtd1"
        }
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

module.exports = Chat;
