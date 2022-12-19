const mongoose = require('mongoose');

const connectMongoose = async () => {
    try {
        const url = process.env.MONGO_URI;
        await mongoose.connect(url, {useNewUrlParser: true});
        console.log("Connected to database !!!");
    }
    catch(err) {
        console.error("Could not connect to database. " + err.message);
        process.exit(1);
    }
}

module.exports = connectMongoose;