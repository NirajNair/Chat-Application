import React, { useEffect, useState } from "react";
import { UserState } from "../../../Contexts/UserContext";
import { CgProfile } from "react-icons/cg";
import { FcOk } from "react-icons/fc";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AddUserModal(props) {
    const [userEmail, setUserEmail] = useState("");

    function handleChange(event) {
        event.preventDefault();
        setUserEmail(event.target.value);
    }

    return (
        <div className="">
            <div className="justify-center items-start my-10 flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-4/5 md:1/2 my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="p-3">
                            <div className="w-11/12 mx-auto">
                                <label className="flex ml-5 py-1 items-center uppercase text-md text-gray-500 font-semibold w-full">
                                    Add Friend
                                </label>
                                <input
                                    type="text"
                                    name="userEmail"
                                    className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="userEmail"
                                    placeholder="Enter Email"
                                    autoComplete="off"
                                    value={userEmail}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center p-3 mb-1">
                            <button
                                className="text-red-500 hover: background-transparent font-bold px-6 py-2 text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={(e) => {
                                    props.handleShowAddUserModal(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white font-bold text-md py-2 px-5 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={(e) =>
                                    props.handleAddUser(e, userEmail)
                                }
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    );
}
