import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserState } from "../../Contexts/UserContext";

export default function Login() {
    const [showPass, setShowPass] = useState(false);
    const [remember, setRemember] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });

    const { setUser } = UserState();

    function toggleRemember(event) {
        event.preventDefault();
        setRemember(!remember);
    }

    function toggleShowPass(event) {
        setShowPass(!showPass);
    }

    function handleFormChange(event) {
        event.preventDefault();
        setFormValue({ ...formValue, [event.target.name]: event.target.value });
    }

    async function handleLogin(event) {
        if (formValue.email && formValue.password) {
            try {
                event.preventDefault();
                formValue["remember"] = remember;
                console.log(formValue);
                await axios
                    .post(
                        "http://localhost:5000/api/user/login",
                        { formValue },
                        { withCredentials: true },
                        {
                            "Content-type": "application/json",
                        }
                    )
                    .then((res) => {
                        console.log(res.data.user);
                        setUser(res.data.user);
                        setErrorMessage(res.data.message);
                    });
                navigate("/chat");
            } catch (error) {
                // console.log(error);
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    setErrorMessage(error.response.data.message);
                }
            }
        } else {
            setErrorMessage("Please fill required fields.");
        }
    }

    return (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500  h-screen">
            <div className="px-6 py-20 h-full text-gray-800 flex flex-col justify-center items-center ">
                <div className=" xl:mx-20 xl:pl-20 xl:pr-20 lg:pl-10 lg:pr-10 xl:w-5/12 lg:w-1/2 md:w-8/12 md:mb-0 sm:w-11/12 bg-white rounded-xl shadow-xl">
                    <h1 className="text-center text-4xl text-gray-800 font-semibold py-10 uppercase">
                        Log In
                    </h1>
                    {errorMessage && (
                        <div
                            className="p-2 bg-red-100 rounded-md text-center w-4/5 flex justify-center text-red-700 text-bold mb-5 mx-auto"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}
                    <form>
                        <div className="mb-3 mx-2">
                            <label
                                htmlFor="email"
                                className="text-md uppercase ml-4 text-gray-500 font-semibold"
                            >
                                Email
                                <span className="text-red-500 font-bold">
                                    *
                                </span>
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
                        <div className="mb-6 mx-2 relative">
                            <label
                                htmlFor="password"
                                className="text-md uppercase ml-4 text-gray-500 font-semibold"
                            >
                                Password
                                <span className="text-red-500 font-bold">
                                    *
                                </span>
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
                        <div className="text-center mx-5 my-5">
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded-full shadow-md hover:bg-blue-800 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                Submit
                            </button>
                            <p className="text-md text-left font-semibold my-5">
                                Don't have an account?
                                <Link
                                    to="/signup"
                                    className="px-2 text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        // <div className=" border px-6 py-10 h-full text-gray-800">
        //     <div className="flex py-20 lg:justify-between justify-center items-center ">
        //         {/* <div className="grow-0 sm:hidden shrink-1 md:shrink-0 basis-auto xl:w-5/12 lg:w-6/12 md:pb-5 md:w-9/12 mb-12 md:mb-0">
        //             <img src={loginImage} className="w-full" alt="Login" />
        //         </div> */}
        //         <div className=" mx-10 xl:mx-20 xl:pl-20 xl:pr-20 lg:pl-10 lg:pr-10 xl:w-5/12 lg:w-5/12 md:w-8/12 md:mb-0 bg-gray-100">
        //             <h1 className="text-center text-4xl text-gray-800 font-semibold py-10">
        //                 Log In
        //             </h1>
        //             {errorMessage && (
        //                 <div
        //                     className="p-2 bg-red-100 rounded-md text-center text-red-700 text-bold mb-5"
        //                     role="alert"
        //                 >
        //                     {errorMessage}
        //                 </div>
        //             )}
        //             <form>
        //                 <div className="mb-6 ml-10 mr-10">
        //                     <label
        //                         htmlFor="email"
        //                         className="text-lg text-gray-500 font-semibold"
        //                     >
        //                         Email
        //                     </label>
        //                     <input
        //                         type="text"
        //                         name="email"
        //                         className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        //                         id="email"
        //                         autoComplete="off"
        //                         onChange={(e) => handleFormChange(e)}
        //                     />
        //                 </div>

        //                 <div className="mb-6 ml-10 mr-10 relative">
        //                     <label
        //                         htmlFor="password "
        //                         className="text-lg text-gray-500 font-semibold"
        //                     >
        //                         Password
        //                     </label>
        //                     <input
        //                         type={showPass === false ? "password" : "text"}
        //                         name="password"
        //                         className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        //                         id="password"
        //                         autoComplete="off"
        //                         onChange={(e) => handleFormChange(e)}
        //                     />
        //                     <div className="text-2xl absolute top-10 right-3">
        //                         {showPass === false ? (
        //                             <AiOutlineEye
        //                                 onClick={() => toggleShowPass()}
        //                             />
        //                         ) : (
        //                             <AiOutlineEyeInvisible
        //                                 onClick={() => toggleShowPass()}
        //                             />
        //                         )}
        //                     </div>
        //                 </div>
        //                 {/* <div className="flex justify-between items-center mb-6 ml-10 mr-10">
        //                     <div className="form-group form-check">
        //                         <input
        //                             type="checkbox"
        //                             className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        //                             id="remember"
        //                             onChange={(e) => toggleRemember(e)}
        //                         />
        //                         <label
        //                             className="form-check-label inline-block text-gray-800"
        //                             htmlFor="remember"
        //                         >
        //                             Remember me
        //                         </label>
        //                     </div>
        //                     <a
        //                         href="#!"
        //                         className="text-gray-800 hover:text-blue-500"
        //                     >
        //                         Forgot password?
        //                     </a>
        //                 </div> */}

        //                 <div className="text-center ml-10 mr-10 mb-3">
        //                     <button
        //                         type="button"
        //                         className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        //                         onClick={(e) => handleLogin(e)}
        //                     >
        //                         Submit
        //                     </button>
        //                     <div className="flex items-center my-3 before:flex-1 before:border-t before:border-gray-300"></div>
        //                     <p className="text-sm text-left font-semibold mb-0">
        //                         Don't have an account?
        //                         <Link
        //                             to="/signup"
        //                             className="px-2 text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out"
        //                         >
        //                             Register
        //                         </Link>
        //                     </p>
        //                 </div>
        //             </form>
        //         </div>
        //     </div>
        // </div>
    );
}
