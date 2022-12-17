import React, { useEffect, useState } from "react";
import { GiTigerHead } from "react-icons/gi";
import { FiLogOut, FiUser } from "react-icons/fi";
import { CgProfile, CgChevronDown, CgMenu, CgOptions } from "react-icons/cg";
import { UserState } from "../../Contexts/UserContext";
import axios from "axios";
import Alert from "../Alerts/Alert";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../static/logo192.png";

export default function Navbar(props) {
    const [userEmail, setUserEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
 
    const navigate = useNavigate();

    function handleChange(event) {
        event.preventDefault();
        setUserEmail(event.target.value);
    }

    function handleClick(event, name) {
        event.preventDefault();
        console.log(name);
        switch (name.toLowerCase()) {
            case "logout":
                console.log("logoutjk");
                handleLogout();
                break;
            case "profile":
                console.log(name);
                break;
            default:
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleFriendSearch(event);
        }
    }

    async function handleLogout() {
        try {
            setUserEmail("");
            await axios
                .get(
                    "http://localhost:5000/api/user/logout",
                    { withCredentials: true },
                    {
                        "Content-type": "application/json",
                    }
                )
                .then((res) => {
                    console.log(res);
                });
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    }

    async function handleFriendSearch(event) {
        try {
            event.preventDefault();
            console.log(userEmail);
            await axios
                .post(
                    "http://localhost:5000/api/chat/addfriend",
                    { email: userEmail },
                    { withCredentials: true },
                    {
                        "Conetent-type": "application/json",
                    }
                )
                .then((res) => {
                    toast.dismiss();
                    toast.success(res.data.msg, {
                        duration: 3000,
                        position: "top-center",
                    });

                    props.handleRender();
                })
                .catch((error) => {
                    console.log(error.response.data.msg);
                    toast.dismiss();
                    toast.error(error.response.data.msg, {
                        duration: 3000,
                        position: "top-center",
                    });
                });
        } catch (err) {
            console.log(err);
        }
    }

    const { user } = UserState();

    return (
        <div >
            <nav className="w-full bg-blue-800 shadow">
                <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                    <div>
                        <div className="flex items-center justify-between py-3 md:py-5 md:block">
                            <div className="flex flex-row items-center ">
                                <img
                                    src={logo}
                                    height={28}
                                    width={28}
                                    alt="Logo"
                                />
                                <h1 className="flex text-white px-2 mb-1 text-lg font-bold uppercase">
                                    Chaty
                                </h1>
                            </div>
                            <div className="md:hidden">
                                <button
                                    className="p-2 text-gray-700 rounded-md outline-none "
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <CgMenu color="white" size={25} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div
                            className={`flex-1 justify-self-center pb-3 mt-2 md:block md:pb-0 md:mt-0 ${
                                isOpen ? "block" : "hidden"
                            }`}
                        >
                            <ul className="items-center justify-center space-y-1 md:flex md:space-x-6 md:space-y-0">
                                <li className="">
                                    <div className="flex flex-row">
                                        <button
                                            onClick={(e) => {
                                                navigate('/profile');
                                            }}
                                            className="px-2 py-1 hover:bg-blue-900 font-semibold rounded-md inline-flex items-center relative"
                                        >
                                            <img
                                                src={user.pic}
                                                className="rounded-full w-7"
                                                alt="Avatar"
                                            />
                                            <p className="text-md text-white px-2">
                                                Hi,{" "}
                                                <span>{user.firstName}</span>
                                            </p>
                                        </button>
                                    </div>
                                </li>
                                <li className="">
                                    <button
                                        onClick={(e) => {
                                            handleLogout(e);
                                        }}
                                        className={` py-1 text-white hover:bg-blue-900 font-semibold rounded-md flex items-center relative`}
                                    >
                                        <div className="flex items-center px-2 h-7">
                                        
                                                <FiLogOut
                                                    color="red"
                                                    size={22}
                                                />
                                            <p className="text-md text-white px-2">
                                                <span>Logout</span>
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
