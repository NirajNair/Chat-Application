const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    pic: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dgmwfmymy/image/upload/v1671199835/defaultavatar_zth6iy.jpg"
    }, 
    picId: {
        type: String,
        required: true,
        default: "defaultavatar_zth6iy"
    }
},{
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;