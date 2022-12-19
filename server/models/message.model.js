const mongoose = require('mongoose');


// sender, content, ref to chat
const msgSchema = mongoose.Schema({

    msg: { type: String, trim: true},
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
   
},
{
    timestamps: true,
});

const Message = mongoose.models.Message || mongoose.model('Message', msgSchema);

module.exports = Message;