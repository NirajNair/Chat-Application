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
    return hashPassword;
};

// save user to database
async function addUserToDB(req, res, newUserObj) {
    const newUser = User(newUserObj);
    await newUser
        .save()
        .then(() => res.status(200).json({ message: "User Created!" }))
        .catch((err) => res.status(400).json({ message: err }));
}

// registers the user
userRouter.post("/signup", upload.single("pic"), async (req, res) => {
    try {
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

                            let newUserObj = {
                                email: email,
                                password: encryptedPassword,
                                firstName: firstName,
                                lastName: lastName,
                            };

                            if (req.file) {
                                let result = await cloudinary.uploader
                                    .upload(req.file.path);
                                newUserObj["pic"] = result.url;
                                newUserObj["picId"] = result.public_id;
                                fs.unlinkSync(req.file.path);
                            }
                            const newUser = User(newUserObj);
                            newUser
                                .save()
                                .then(() => {
                                    res.status(200).json({
                                        message: "User Created!",
                                    });
                                })
                                .catch((err) =>
                                    res.status(400).json({ message: err })
                                );
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
        if (email || password) {
            const encryptedPassword = encryptPassword(
                password,
                process.env.SECRET
            );

            if (validator.isEmail(email)) {
                const user = await User.findOne({
                    email: email.toLowerCase(),
                    password: encryptedPassword,
                });
                if (user) {
                    req.session.user = user;
                    console.log(user);
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
    req.session.destroy((err) => {
        if (err) {
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
            const { firstName, lastName } = req.body;
            let updatedUserObj = {};
            if (
                firstName !== req.session.user.firstName ||
                lastName !== req.session.user.lastName
            ) {
                updatedUserObj["firstName"] = firstName;
                updatedUserObj["lastName"] = lastName;
            }

            if (req.file) {
                if (!req.session.user.picId.toString().includes("default")) {
                    await cloudinary.uploader.destroy(req.session.user.picId);
                }
                const uploadedPic = await cloudinary.uploader.upload(
                    req.file.path
                );
                updatedUserObj["pic"] = uploadedPic.url;
                updatedUserObj["picId"] = uploadedPic.public_id;
                fs.unlinkSync(req.file.path);
            }
            if (updatedUserObj) {
                await User.findOneAndUpdate(
                    { _id: req.session.user._id },
                    { $set: updatedUserObj }
                );
                const user = await User.findOne({ _id: req.session.user._id });
                if (!user) {
                    res.status(404).send("User not found");
                } else {
                    console.log(user);
                    req.session.user = user;
                    res.status(200).json({ user: user });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
);

userRouter.post("/changepassword", authenticate, async (req, res) => {
    try {
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
