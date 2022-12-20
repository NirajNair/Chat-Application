import React, { useState, useEffect } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { MdOutlineArrowBack } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../Contexts/UserContext";
import Navbar from "../Navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { user, setUser } = UserState();

    const navigate = useNavigate();

    const [formValue, setFormValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [pic, setPic] = useState();

    const API_URL =
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_DEV_URL
            : process.env.REACT_APP_PROD_URL;
    
    function handlePicUpload(event) {
        setPic(event);
    }
    useEffect(() => {
        let userDet = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        setFormValue(userDet);
    }, []);
    
    function handleFormChange(event) {
        event.preventDefault();
        setFormValue({ ...formValue, [event.target.name]: event.target.value });
    }


    function toggleShowOldPass(event) {
        event.preventDefault();
        setShowOldPass(!showOldPass);
    }

    function toggleShowPass(event) {
        event.preventDefault();
        setShowNewPass(!showNewPass);
    }

    function toggleShowConfirmPass(event) {
        event.preventDefault();
        setShowConfirmNewPass(!showConfirmNewPass);
    }

    async function handleSaveChanges(event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("firstName", formValue.firstName);
        formData.append("lastName", formValue.lastName);
        if(pic) {
            console.log("pic")
            formData.append("pic", pic);
        }
        try {
            if(pic || user.firstName !== formValue.firstName || user.lastName !== formValue.lastName) {
                await axios
                    .post(
                        `${API_URL}/api/user/updateuser`,
                        formData,
                        { withCredentials: true },
                        {
                            "Content-Type": "multipart/form-data",
                        }
                    )
                    .then((res) => {
                        if (res.status === 200) {
                            console.log(res.data.user);
                            setUser(res.data.user);
                        }
                    });
            }
        } catch (error) {
            setErrorMessage(error);
        }
    }

    async function handleChangePassword(event) {
        event.preventDefault();
        let formData = {};
        formData["oldPassword"] = formValue.oldPassword;
        formData["newPassword"] = formValue.newPassword;
        formData["confirmNewPassword"] = formValue.confirmNewPassword;
        try {
            await axios
                .post(
                    `${API_URL}/api/user/changepassword`,
                    formData,
                    { withCredentials: true },
                    {
                        "Content-Type": "application/json",
                    }
                )
                .then((res) => {
                    toast.dismiss();
                    toast.success(res.data.msg, {
                        duration: 2000,
                        position: "top-center",
                    });
                    setFormValue({
                        oldPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                    });
                });
        } catch (err) {
            toast.dismiss();
            toast.success(err, {
                duration: 2000,
                position: "top-center",
            });
        }
    }

    return (
        <div className="">
            <div className="h-fit">
                <Navbar />
            </div>
            <Toaster />
            <div className="flex justify-center w-full h-full my-5">
                <div>
                    <div className="px-1">
                        <div className="flex justify-start">
                            <div className="flex justify-center items-center">
                                <button
                                    className="hover:bg-slate-100 hover:rounded-full p-1"
                                    onClick={(e) => navigate("/chat")}
                                >
                                    <MdOutlineArrowBack
                                        color="black"
                                        size={25}
                                    />
                                </button>
                            </div>
                            <div className="flex justify-center w-full my-auto">
                                <h1 className="text-center text-3xl text-gray-800 font-semibold uppercase">
                                    Edit Profile
                                </h1>
                            </div>
                        </div>
                    </div>

                    <form>
                        <div className="flex flex-row justify-center pb-5">
                            <div className="flex">
                                <div className="flex ">
                                    <img
                                        src={user.pic}
                                        className="rounded-full w-30"
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <div className="h-fit">
                                        <input
                                            className="form-control block w-full px-4 py-3 text-md font-normal text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            type="file"
                                            onChange={(e) => {
                                                handlePicUpload(
                                                    e.target.files[0]
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row mb-3 mx-3 ">
                            <div className="basis-6/12 mr-2  sm:w-6/6">
                                <label
                                    htmlFor="firstName"
                                    className="text-md ml-4 uppercase text-gray-500 font-semibold"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="firstName"
                                    autoComplete="off"
                                    required
                                    value={formValue.firstName}
                                    onChange={(e) => handleFormChange(e)}
                                />
                            </div>
                            <div className="basis-6/12 sm:w-6/6 ml-2">
                                <label
                                    htmlFor="lastName"
                                    className="text-md ml-4 uppercase text-gray-500 font-semibold"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="lastName"
                                    autoComplete="off"
                                    required
                                    value={formValue.lastName}
                                    onChange={(e) => handleFormChange(e)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 mx-3">
                            <label
                                htmlFor="email"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-black bg-slate-100 bg-clip-padding border border-solid border-gray-300 rounded-full  m-0"
                                id="email"
                                autoComplete="off"
                                required
                                value={formValue.email}
                                readOnly
                                onChange={(e) => handleFormChange(e)}
                            />
                        </div>
                        <div className="text-center mx-3 my-5">
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                Save
                            </button>
                        </div>
                        <div className="pb-1" />
                        <hr />
                        <div className="py-2" />
                        <div>
                            <h1 className="text-center text-2xl text-gray-800 font-semibold pb-3 uppercase">
                                Change Password
                            </h1>
                            {errorMessage && (
                                <div
                                    className="p-2 bg-red-100 rounded-full text-center text-red-700 text-bold mb-5"
                                    role="alert"
                                >
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        <div className="mb-3 mx-3 relative">
                            <label
                                htmlFor="oldPassword"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Old Password
                                <span className="text-red-500 font-bold">
                                    *
                                </span>
                            </label>
                            <input
                                type={
                                    showOldPass === false ? "password" : "text"
                                }
                                name="oldPassword"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="oldPassword"
                                autoComplete="off"
                                required
                                value={formValue.oldPassword}
                                onChange={(e) => handleFormChange(e)}
                            />
                            <div className="text-2xl absolute top-9 right-3">
                                {showOldPass === false ? (
                                    <AiOutlineEye
                                        onClick={(e) => toggleShowOldPass(e)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        onClick={(e) => toggleShowOldPass(e)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="mb-3 mx-3 relative">
                            <label
                                htmlFor="newPassword"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                New Password
                                <span className="text-red-500 font-bold">
                                    *
                                </span>
                            </label>
                            <input
                                type={
                                    showNewPass === false ? "password" : "text"
                                }
                                name="newPassword"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="newPassword"
                                autoComplete="off"
                                required
                                value={formValue.newPassword}
                                onChange={(e) => handleFormChange(e)}
                            />
                            <div className="text-2xl absolute top-9 right-3">
                                {showNewPass === false ? (
                                    <AiOutlineEye
                                        onClick={(e) => toggleShowPass(e)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        onClick={(e) => toggleShowPass(e)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="mb-3 mx-3 relative">
                            <label
                                htmlFor="confirmNewPassword"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Confirm New Password
                                <span className="text-red-500 font-bold">
                                    *
                                </span>
                            </label>
                            <input
                                type={
                                    showConfirmNewPass === false
                                        ? "password"
                                        : "text"
                                }
                                name="confirmNewPassword"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="confirmNewPassword"
                                autoComplete="off"
                                required
                                value={formValue.confirmNewPassword}
                                onChange={(e) => handleFormChange(e)}
                            />
                            <div className="text-2xl absolute top-9 right-3">
                                {showConfirmNewPass === false ? (
                                    <AiOutlineEye
                                        onClick={(e) =>
                                            toggleShowConfirmPass(e)
                                        }
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        onClick={(e) =>
                                            toggleShowConfirmPass(e)
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <div className="text-center mx-3 my-5">
                            <button
                                type="button"
                                onClick={handleChangePassword}
                                className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
