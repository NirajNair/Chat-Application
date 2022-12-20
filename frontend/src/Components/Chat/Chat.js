import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserState } from "../../Contexts/UserContext";
import Navbar from "../Navbar/Navbar";
import ChatsList from "./ChatsList/ChatsList";
import GroupModal from "./GroupModal/GroupModal";
import ChatWindow from "./ChatWindow/ChatWindow";
import AddUserModal from "./AddUserModal/AddUserModal";
import toast, { Toaster } from "react-hot-toast";

export default function Chat() {
    const [searchResult, setSearchResult] = useState([]);
    const [searchFriend, setSearchFriend] = useState("");
    const [searchOnFocus, setSearchOnFocus] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [timer, setTimer] = useState(null);

    // const [selectedChat, setSelectedChat] = useState();
    const [render, setRender] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const API_URL =
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_DEV_URL
            : process.env.REACT_APP_PROD_URL;

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    const {
        user,
        friendList,
        selectedChat,
        setSelectedChat,
        setFriendList,
        chatList,
        setChatList,
    } = UserState();

    function handleSearchFriend(friend) {
        setSearchFriend(friend);
    }

    function handleRender() {
        setRender(!render);
    }

    function handleSearchFocus(boolValue) {
        setSearchOnFocus(boolValue);
    }

    function handleShowGroupModal(boolValue) {
        setShowGroupModal(boolValue);
    }

    function handleShowAddUserModal(boolValue) {
        setShowAddUserModal(boolValue);
    }

    async function getFriendList() {
        await axios
            .get(
                `${API_URL}/api/chat/friendList`,
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
            )
            .then((res) => {
                var resFriendList = res.data;
                setFriendList(resFriendList);
            });
    }

    function searchUsers() {
        clearTimeout(timer);
        let searchParam = searchFriend;
        if (searchParam === "") {
            setSearchResult(friendList);
        } else {
            let regexExp = new RegExp(`${searchParam}*`);
            let matches = friendList.filter((friend) => {
                return regexExp.test(
                    friend.firstName.toLowerCase() +
                        friend.lastName.toLowerCase()
                );
            });
            setSearchResult(matches);
        }
    }
  
    useEffect(() => {
        searchUsers();
    }, [searchFriend]);

    async function handleAddUser(event, userEmail) {
        try {
            event.preventDefault();
            await axios
                .post(
                    `${API_URL}/api/chat/addfriend`,
                    { email: userEmail },
                    { withCredentials: true },
                    {
                        "Conetent-type": "application/json",
                    }
                )
                .then((res) => {
                    handleShowAddUserModal(false);
                    let updatedChatList = chatList;
                    updatedChatList.unshift(res.data.chatDetails);
                    toast.dismiss();
                    toast.success(res.data.msg, {
                        duration: 3000,
                        position: "top-center",
                    });
                    setChatList([...updatedChatList]);
                    getFriendList();
                })
                .catch((error) => {
                    toast.dismiss();
                    toast.error(error.response.data.msg, {
                        duration: 3000,
                        position: "top-center",
                    });
                });
        } catch (err) {
            toast.dismiss();
            toast.error(err, {
                duration: 3000,
                position: "top-center",
            });
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getFriendList();
        setIsLoading(false);
    }, []);

    useEffect(() => {}, [selectedChat]);

    function handleRemoveSelectedChat() {
        setSelectedChat();
    }

    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            <div className="h-fit">
                <Navbar handleRender={handleRender} />
            </div>
            <Toaster />
            <div className="h-full flex items-center">
                {!isLoading &&
                    (width < 950 ? (
                        selectedChat ? (
                            <div className="w-full h-full bg-white">
                                <div className="h-full relative">
                                    {selectedChat && (
                                        <ChatWindow
                                            handleRemoveSelectedChat={
                                                handleRemoveSelectedChat
                                            }
                                            key={selectedChat._id}
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full w-full bg-white ">
                                <div className="flex pt-1 px-5">
                                    <div className="w-4/5">
                                        <h2 className="text-md text-black first-letter:text-2xl uppercase font-semibold">
                                            Chats
                                        </h2>
                                    </div>
                                </div>
                                <div className="h-full flex-grow overflow-y-scroll scrollbar-hide">
                                    <ChatsList
                                        handleShowGroupModal={
                                            handleShowGroupModal
                                        }
                                        handleShowAddUserModal={
                                            handleShowAddUserModal
                                        }
                                    />
                                </div>
                            </div>
                        )
                    ) : (
                        <div
                            className={
                                "bg-white md:w-10/12 md:mx-auto flex justify-center w-full my-auto md:h-5/6 rounded-lg border" +
                                (width < 770 ? "h-screen w-full" : "")
                            }
                        >
                            <div className="grid grid-cols-3 h-full w-full">
                                <div className="flex flex-col">
                                    <div className="flex flex-row pt-1 px-5">
                                        <div className="w-4/5 uppercase">
                                            <h2 className="text-md text-black first-letter:text-2xl uppercase font-semibold ">
                                                Chats
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="h-full flex-grow overflow-y-scroll scrollbar-hide">
                                        <ChatsList
                                            handleShowGroupModal={
                                                handleShowGroupModal
                                            }
                                            handleShowAddUserModal={
                                                handleShowAddUserModal
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="border-l col-span-2 h-full relative flex items-center justify-center">
                                    {selectedChat ? (
                                        <div className="w-full h-full">
                                            <ChatWindow
                                                handleRemoveSelectedChat={
                                                    handleRemoveSelectedChat
                                                }
                                                key={selectedChat._id}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center my-auto">
                                            <span className="uppercase font-semibold">
                                                select a chat
                                            </span>
                                            <span>👈</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {showGroupModal && (
                <GroupModal handleShowGroupModal={handleShowGroupModal} />
            )}
            {showAddUserModal && (
                <AddUserModal
                    handleShowAddUserModal={handleShowAddUserModal}
                    handleAddUser={handleAddUser}
                />
            )}
        </div>
    );
}
