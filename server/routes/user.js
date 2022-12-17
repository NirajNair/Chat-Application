const express = require("express");
const User = require("../models/user.model");
const validator = require("validator");
const crypto = require("crypto");
const { authenticate } = require("../middleware/authMiddleware");
const cloudinary = require("../cloudinary/cloudinary.config");
const upload = require("../multer/multer.config");
const fs = require("fs");
require("dotenv").config();

const userRouter = express.Router();

let encryptPassword = (password, key) => {
    const hashPassword = crypto
        .createHmac("sha256", key)
        .update(password)
        .digest("hex");
    // console.log("hash: "+ hashPassword);
    return hashPassword;
};

// save user to database

async function addUserToDB(req, res, newUserObj) {
    console.log(newUserObj);
    const newUser = User(newUserObj);
    await newUser
        .save()
        .then(() => res.status(200).json({ message: "User Created!" }))
        .catch((err) => res.status(400).json({ message: err }));
}

// registers the user
userRouter.post("/signup", upload.single("pic"), async (req, res) => {
    try {
        console.log(req.body, req.file);
        const { firstName, lastName, email, password, confirmPassword } =
            req.body;
        if (firstName && lastName && email && password && confirmPassword) {
            if (User.count({ email: email }) > 0) {
                res.status(400).json({
                    message: "User Exists. Try signing in.",
                });
            } else {
                if (!validator.isEmail(email)) {
                    res.status(400).json({
                        message: "Incorrect Email Address format.",
                    });
                } else {
                    if (!validator.isStrongPassword(password)) {
                        console.log("not strong pass");
                        res.status(400).json({
                            message:
                                "Please use password of length 8 with minimum 1 Capital Letter, 1 Number and 1 Special Character and ",
                        });
                    } else {
                        if (password !== confirmPassword) {
                            res.status(400).json({
                                message: "Passwords do not match.",
                            });
                        } else {
                            const encryptedPassword = encryptPassword(
                                password,
                                process.env.SECRET
                            );

                            const newUserObj = {
                                email: email,
                                password: encryptedPassword,
                                firstName: firstName,
                                lastName: lastName,
                            };

                            if (req.file) {
                                console.log(req.file.path);

                                await cloudinary.uploader
                                    .upload(req.file.path)
                                    .then((result) => {
                                        console.log(result);
                                        newUserObj["pic"] = result.url;
                                        newUserObj["picId"] = result.public_id;
                                        fs.unlinkSync(req.file.path);
                                        const newUser = User(newUserObj);
                                        console.log(newUser);
                                        newUser
                                            .save()
                                            .then(() => {
                                                console.log("success");
                                                res.status(200).json({
                                                    message: "User Created!",
                                                });
                                            })
                                            .catch((err) =>
                                                res
                                                    .status(400)
                                                    .json({ message: err })
                                            );
                                    });
                            }
                        }
                    }
                }
            }
        } else {
            res.status(400).json({ message: "Please fill all the fields" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Could not resgister the user." });
    }
});

// logs in the user
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password, remember } = req.body.formValue;
        console.log(email, password, remember);
        if (email || password) {
            const encryptedPassword = encryptPassword(
                password,
                process.env.SECRET
            );
            console.log(encryptedPassword);

            if (validator.isEmail(email)) {
                const user = await User.findOne({
                    email: email.toLowerCase(),
                    password: encryptedPassword,
                });
                if (user) {
                    req.session.user = user;
                    console.log(req.session);
                    res.status(200).json({
                        message: "Log In successful",
                        user: user,
                    });
                } else {
                    res.status(401).json({
                        message: "Incorrect email id or password",
                    });
                }
            } else {
                res.status(401).json({ message: "Enter valid email address." });
            }
        } else {
            res.status(401).json({
                message: "Please enter a valid email and password.",
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
});

// logs out the user
userRouter.get("/logout", authenticate, (req, res) => {
    // console.log("cookie session id: ", req.cookies['_sessionId'])
    // console.log("redis session id: ",req.sessionID);
    req.session.destroy((err) => {
        if (err) {
            console.log("redis error");
            console.log(err);
        } else {
            res.clearCookie("_sessionId");
            res.status(200).json({ message: "Logout successful" });
        }
    });
});

userRouter.get("/", authenticate, (req, res) => {
    try {
        if (req.session.user) {
            res.status(200).send({ user: req.session.user });
        }
    } catch (err) {
        console.log(err);
    }
});

userRouter.post(
    "/updateUser",
    authenticate,
    upload.single("pic"),
    async (req, res) => {
        try {
            const { firstName, lastName, pic, picId } = req.body;
            let updatedUserObj = {};
            updatedUserObj["firstName"] = firstName;
            updatedUserObj["lastName"] = lastName;
            updatedUserObj["pic"] = pic;
            updatedUserObj["picId"] = picId;

            if (req.file) {
                console.log("current id: ", req.session.user.picId);
                await cloudinary.uploader.destroy(req.session.user.picId);
                await cloudinary.uploader.upload(req.file.path);
                console.log("uploaded pic ", uploadedPic);
                updatedUserObj["pic"] = uploadedPic.url;
                updatedUserObj["picId"] = uploadedPic.public_id;
                console.log("new id: ", uploadedPic.public_id);
                fs.unlinkSync(req.file.path);
            }
            console.log("user obj", updatedUserObj);
            if (updatedUserObj) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: req.session.user._id },
                    { $set: updatedUserObj }
                ).select("-password");
                if (!updatedUser) {
                    res.status(404).send("User not found");
                } else {
                    console.log(updatedUser);
                    req.session.user = updatedUser;
                    res.status(200).json({ user: updatedUser });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
);

userRouter.post("/changepassword", authenticate, async (req, res) => {
    try {
        console.log(req.body);
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (oldPassword === newPassword) {
            res.status(400).json({
                msg: "New password cannot be the same as old password.",
            });
        }
        if (newPassword !== confirmNewPassword) {
            res.status(400).json({
                msg: "New password could not be confirmed.",
            });
        }
        const oldEncryptedPassword = encryptPassword(
            oldPassword,
            process.env.SECRET
        );

        let userFound = await User.find({ password: oldEncryptedPassword });
        if (userFound) {
            let newEncryptedPassword = encryptPassword(
                newPassword,
                process.env.SECRET
            );
            await User.update(
                { _id: req.session.user._id },
                { $set: { password: newEncryptedPassword } }
            ).select("-password");

            res.status(200).json({ msg: "Password changed successfully" });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = userRouter;
