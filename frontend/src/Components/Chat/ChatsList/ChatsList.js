import React, { useEffect, useState, useRef } from "react";
import { CgClose } from "react-icons/cg";
import axios from "axios";
import toast from "react-hot-toast";
import { UserState } from "../../../Contexts/UserContext";
import ChatsListLoading from "./ChatsListLoading";
import { MdGroupAdd, MdPersonAdd } from "react-icons/md";

export default function ChatsList(props) {
    const [searchList, setSearchList] = useState();
    const [search, setSearch] = useState("");
    const [timer, setTimer] = useState(null);

    const { user, chatList, setChatList, setSelectedChat } =
        UserState();

    async function getChatList() {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/chat`, {
                withCredentials: true,
            });
            setChatList(await data);
            setSearchList(await data);
        } catch (err) {
            toast.error("Failed to load chat");
        }
    }

    function handleChange(event) {
        event.preventDefault();
        setSearch(event.target.value);
        if (event.target.value === "") {
            setSearchList(chatList);
        } else {
            clearTimeout(timer);
            setSearch(event.target.value.toLowerCase());
            const newTimer = setTimeout(() => {
                let regexExp = new RegExp(
                    `${event.target.value.toLowerCase()}*`
                );
                let matches = chatList.filter((chat) => {
                    if (!chat.groupChat) {
                        let searchedUser =
                            chat.users[0]._id.toString() === user._id.toString()
                                ? chat.users[1]
                                : chat.users[0];
                        return regexExp.test(
                            searchedUser.firstName.toLowerCase() +
                                searchedUser.lastName.toLowerCase()
                        );
                    }
                    return regexExp.test(chat.chatName.toLowerCase());
                });
                setSearchList(matches);
            }, 100);
            setTimer(newTimer);
         }
    }

    function handleClearSearch(event) {
        event.preventDefault();
        setSearch("");

        setSearchList(chatList);
    }

    function handleShowGroupModal(event) {
        event.preventDefault();
        props.handleShowGroupModal(true);
    }

    function handleShowAddUserModal(event) {
        event.preventDefault();
        props.handleShowAddUserModal(true);
    }

    useEffect(() => {
        if (!chatList) {
            getChatList();
        }
        setSearchList(chatList);
    }, [chatList]);

    return (
        <div>
            <div className="w-fullbg-white">
                <div className="flex flex-row p-1">
                    <div className="flex p-1 w-5/6 lg:5/6 relative">
                        <input
                            type="text"
                            name="friendname"
                            className="form-control block w-full  px-4 py-1 
                                        text-md font-normal text-gray-700 bg-white bg-clip-padding
                                        border border-solid border-gray-300 rounded-full
                                        transition ease-in-out m-0 focus:text-gray-700
                                        focus:bg-white focus:border-blue-600 focus:outline-none
                                        "
                            id="friendname"
                            placeholder="Search User"
                            autoComplete="off"
                            value={search}
                            onChange={(e) => handleChange(e)}
                        />
                        <div className="text-xl absolute m-auto rounded-full top-2.5 right-3 ">
                            {search && (
                                <button>
                                    <CgClose
                                        onClick={(e) => handleClearSearch(e)}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center w-1/12 lg:1/12">
                        <div className="flex p-1 items-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700  text-white rounded-full
                                        ml-auto p-2"
                                onClick={(e) => handleShowAddUserModal(e)}
                            >
                                <MdPersonAdd size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center w-1/12 lg:1/12">
                        <div className=" p-1 flex items-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700  text-white rounded-full
                                    ml-auto p-2"
                                onClick={(e) => handleShowGroupModal(e)}
                            >
                                <MdGroupAdd size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-b">
                {searchList ? (
                    searchList.map((chat) => (
                        <div
                            className={
                                "px-5 py-2 transition ease-out flex flex-row hover:bg-gray-200 border-t h-16"
                                // (selectedChat && selectedChat._id.toString() === chat._id.toString())
                                //     ? "bg-gray-200"
                                //     : ""
                            }
                            key={chat._id}
                            onClick={(e) => {
                                setSelectedChat(chat);
                            }}
                        >
                            <div className="my-auto pr-3">
                                <img
                                    src={
                                        chat.groupChat
                                            ? chat.groupPic
                                            : chat.users[0]._id !== user._id
                                            ? chat.users[0].pic
                                            : chat.users[1].pic
                                    }
                                    className="rounded-full w-9"
                                    alt="Avatar"
                                />
                                {/* <CgProfile color="black" size={40} /> */}
                            </div>
                            <div className="my-auto flex flex-col truncate w-11/12">
                                <h1 className="font-bold text-md text-black">
                                    {chat.groupChat
                                        ? chat.chatName
                                        : chat.users[0]._id !== user._id
                                        ? chat.users[0].firstName +
                                          " " +
                                          chat.users[0].lastName
                                        : chat.users[1].firstName +
                                          " " +
                                          chat.users[1].lastName}
                                </h1>
                                <p className="text-sm italic text-gray-800">
                                    <span>
                                        {chat.lastMessage[0] && chat.groupChat
                                            ? chat.lastMessage[0].sender
                                                  .firstName +
                                              " " +
                                              chat.lastMessage[0].sender
                                                  .lastName +
                                              ": "
                                            : ""}
                                    </span>
                                    {chat.lastMessage[0]
                                        ? chat.lastMessage[0].msg
                                        : ""}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <ChatsListLoading />
                )}
            </div>
        </div>
    );
}
