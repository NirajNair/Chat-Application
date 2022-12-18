import React, { useState, useEffect } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const [formValue, setFormValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [pic, setPic] = useState();

    function handleFormChange(event) {
        event.preventDefault();
        setFormValue({ ...formValue, [event.target.name]: event.target.value });
    }

    function handlePicUpload(event) {
        console.log(event);
        setPic(event);

    }

    function toggleShowPass(event) {
        event.preventDefault();
        setShowPass(!showPass);
    }

    function toggleShowConfirmPass(event) {
        event.preventDefault();
        setShowConfirmPass(!showConfirmPass);
    }

    async function handleSignup(event) {
        event.preventDefault();
        formValue["pic"] = pic;
        let formData = new FormData();
        formData.append("firstName", formValue.firstName);
        formData.append("lastName", formValue.lastName);
        formData.append("email", formValue.email);
        formData.append("password", formValue.password);
        formData.append("confirmPassword", formValue.confirmPassword);
        formData.append("pic", pic);
        if(!formValue.firstName || !formValue.lastName || !formValue.email || !formValue.password || !formValue.confirmPassword) {
            setErrorMessage("Please fill all required field")
        } else {
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
            try {
                await axios
                    .post(
                        `${process.env.REACT_APP_URL}/api/user/signup`,
                        formData ,
                        { withCredentials: true },
                        {   
                            "Content-Type": "multipart/form-data",
                        }
                    )
                    .then((res) => {
                        // console.log(res);
                        setErrorMessage(res.message);
                    });
                navigate("/login");
            } catch (error) {
                // console.log(error);
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    setErrorMessage(error.response.data.message);
                }
            }
        }
    }

    // useEffect(() => {

    // }, [errorMessage]);

    return (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-screen">
            <div className="px-6 py-20 h-full text-gray-800 flex flex-col justify-center items-center ">
                <div className=" xl:mx-20 xl:pl-20 xl:pr-20 lg:pl-10 lg:pr-10 xl:w-5/12 lg:w-1/2 md:w-8/12 md:mb-0 bg-white rounded-xl shadow-xl">
                    <h1 className="text-center text-4xl text-gray-800 font-semibold py-10 uppercase">
                        Sign Up
                    </h1>
                    {errorMessage && (
                        <div
                            className="p-2 bg-red-100 rounded-full text-center text-red-700 text-bold mb-5"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}
                    <form>
                        <div className="flex flex-row mb-3 mx-3 ">
                            <div className="basis-6/12 mr-2  sm:w-6/6">
                                <label
                                    htmlFor="firstName"
                                    className="text-md ml-4 uppercase text-gray-500 font-semibold"
                                >
                                    First Name<span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="firstName"
                                    autoComplete="off"
                                    required
                                    onChange={(e) => handleFormChange(e)}
                                />
                            </div>
                            <div className="basis-6/12 sm:w-6/6 ml-2">
                                <label
                                    htmlFor="lastName"
                                    className="text-md ml-4 uppercase text-gray-500 font-semibold"
                                >
                                    Last Name<span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="lastName"
                                    autoComplete="off"
                                    required
                                    onChange={(e) => handleFormChange(e)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 mx-3">
                            <label
                                htmlFor="email"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Email<span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="email"
                                autoComplete="off"
                                required
                                onChange={(e) => handleFormChange(e)}
                            />
                        </div>
                        <div className="mb-6 mx-3 relative">
                            <label
                                htmlFor="password"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Password<span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type={showPass === false ? "password" : "text"}
                                name="password"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="password"
                                autoComplete="off"
                                required
                                onChange={(e) => handleFormChange(e)}
                            />
                            <div className="text-2xl absolute top-9 right-3">
                                {showPass === false ? (
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
                        <div className="mb-6 mx-3 relative">
                            <label
                                htmlFor="confirmPassword"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Confirm Password<span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type={
                                    showConfirmPass === false
                                        ? "password"
                                        : "text"
                                }
                                name="confirmPassword"
                                className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="confirmPassword"
                                autoComplete="off"
                                required
                                onChange={(e) => handleFormChange(e)}
                            />
                            <div className="text-2xl absolute top-9 right-3">
                                {showConfirmPass === false ? (
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
                        <div className="mb-3 mx-3">
                            <label
                                htmlFor="file_input"
                                className="text-md ml-4 uppercase text-gray-500 font-semibold"
                            >
                                Upload Profile Picture
                            </label>
                            <input
                                className="form-control block w-full px-4 py-3 text-md font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                type="file"
                                onChange={(e) => {handlePicUpload(e.target.files[0])}}
                            />
                        </div>
                        <div className="text-center mx-3 my-5">
                            <button
                                type="button"
                                onClick={handleSignup}
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
