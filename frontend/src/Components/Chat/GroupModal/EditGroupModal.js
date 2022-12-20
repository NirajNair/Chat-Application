import React, { useEffect, useState } from "react";
import { UserState } from "../../../Contexts/UserContext";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { HiOutlineMinusCircle } from "react-icons/hi";
import axios from "axios";

export default function EditGroupModal(props) {
    const [groupMembers, setGroupMembers] = useState([]);
    const [searchGroupMembers, setSearchGroupMembers] = useState("");
    const [groupName, setGroupName] = useState("");
    const [newMembers, setNewMembers] = useState([]);
    const [searchMatches, setSearchMatches] = useState();
    const [timer, setTimer] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        user,
        chatList,
        setChatList,
        friendList,
        setFriendList,
        selectedChat,
        setSelectedChat,
    } = UserState();

    async function getFriendList() {
        await axios
            .get(
                `${process.env.REACT_APP_URL}/api/chat/friendList`,
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
            )
            .then((res) => {
                let newMemberList = res.data.filter(
                    (friend) =>
                        !selectedChat.users.find(
                            ({ _id }) =>
                                friend._id.toString() === _id.toString()
                        )
                );

                setNewMembers(newMemberList);
                setFriendList(res.data);
            });
    }

    useEffect(() => {
        if (!friendList) {
            getFriendList();
        }
        let newMemberList = friendList.filter(
            (friend) =>
                !selectedChat.users.find(
                    ({ _id }) => friend._id.toString() === _id.toString()
                )
        );
        setGroupMembers(selectedChat.users);
        setGroupName(selectedChat.chatName);
        setNewMembers(newMemberList);
    }, []);

    function handleChange(event) {
        event.preventDefault();
        switch (event.target.name) {
            case "groupName":
                setGroupName(event.target.value);
                break;
            case "searchNewMembers":
                setSearchGroupMembers(event.target.value.toLowerCase());
                console.log(event.target.value.toLowerCase());
                clearTimeout(timer);
                const newTimer = setTimeout(() => {
                    let regexExp = new RegExp(
                        `${event.target.value.toLowerCase()}*`
                    );
                    let matches = newMembers.filter((friend) => {
                        return regexExp.test(
                            friend.firstName.toLowerCase() +
                                friend.lastName.toLowerCase()
                        );
                    });
                    console.log(matches);
                    setSearchMatches(matches);
                }, 100);
                setTimer(newTimer);
                break;
            default:
                break;
        }
    }

    function handleSelectFriend(event, key) {
        event.preventDefault();
        let newGroupMember = newMembers.filter(
            (friend) => friend._id.toString() === key.toString()
        );
        let newMemberList = newMembers.filter(
            (friend) => friend._id.toString() !== key.toString()
        );
        groupMembers.push(newGroupMember[0]);
        setNewMembers(newMemberList);
        setGroupMembers(groupMembers);
    }

    function handleDeselectFriend(event, key) {
        event.preventDefault();
        let newGroupMembers = groupMembers.filter(
            (friend) => friend._id.toString() !== key.toString()
        );
        let newMember = groupMembers.filter(
            (friend) => friend._id.toString() === key.toString()
        );
        newMembers.push(newMember[0]);
        let arrOfNewMembers = newMembers;
        setNewMembers(arrOfNewMembers);
        setGroupMembers(newGroupMembers);
    }

    async function handleDeleteGroup(event) {
        event.preventDefault();
        let chat = selectedChat;
        props.handleShowEditGroupModal(event);
        await axios
            .post(
                `${process.env.REACT_APP_URL}/api/chat/deletegroup`,
                { chat },
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    let newChatList = chatList.filter(
                        (chat) =>
                            chat._id.toString() !== selectedChat._id.toString()
                    );
                    setChatList(newChatList);
                    setSelectedChat();

                }
            })
            .catch((err) => {});
    }

    async function handleLeaveGroup(event) {
        let userDetail = {};
        userDetail["chatId"] = selectedChat._id;
        userDetail["userId"] = user._id;
        await axios
            .post(
                `${process.env.REACT_APP_URL}/api/chat/leavegroup`,
                { userDetail },
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
            )
            .then((res) => {
                let newChatList = chatList.filter(
                    (chat) =>
                        chat._id.toString() !== selectedChat._id.toString()
                );
                console.log(newChatList)
                setChatList(newChatList);
                setSelectedChat();
                props.handleShowEditGroupModal(event);
            })
            .catch((err) => {
                setErrorMessage(err);
            });
    }

    async function handleSaveChanges(event) {
        event.preventDefault();
        if (groupName === "") {
            setErrorMessage("Please enter a group name");
        } else if (groupMembers.length === 0) {
            setErrorMessage("Please add group members.");
        } else {
            let group = {};
            let userIdList = [];
            groupMembers.map((member) => userIdList.push(member._id));
            group["chatId"] = selectedChat._id;
            group["chatName"] = groupName;
            group["users"] = userIdList;
            await axios
            .post(
                `${process.env.REACT_APP_URL}/api/chat/updategroup`,
                { group },
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
                )
                .then((res) => {
                    for (var i = 0; i < chatList.length; i++) {
                        if (chatList[i]._id.toString() === res.data._id.toString()) {
                            chatList[i] = res.data;
                            setChatList(chatList);
                            break;
                        }
                    }
                    props.handleShowEditGroupModal(event);
                })
                .catch((err) => {
                    setErrorMessage(err);
                });
        }
    }

    return (
        <div>
            <div className="justify-center items-start my-10 flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative md:w-2/5 sm:11/12 my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-2xl font-semibold">
                                Group Details
                            </h3>
                            <div className=" flex items-center">
                                {selectedChat.groupAdmin._id.toString() ===
                                user._id ? (
                                    <button
                                        className="hover:bg-slate-100 hover:rounded-full p-1 "
                                        onClick={(e) => handleDeleteGroup(e)}
                                    >
                                        <MdDeleteOutline
                                            color="red"
                                            size={25}
                                        />
                                    </button>
                                ) : (
                                    <button
                                        className="hover:bg-slate-100 hover:rounded-full p-1 "
                                        onClick={(e) => handleLeaveGroup(e)}
                                    >
                                        <IoMdExit color="red" size={25} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-3 pt-5">
                            {errorMessage && (
                                <div
                                    className="p-2 bg-red-100 rounded-md text-center text-red-700 text-bold mb-5"
                                    role="alert"
                                >
                                    {errorMessage}
                                </div>
                            )}
                            <div className="w-11/12 mx-auto pb-2">
                                <label
                                    htmlFor="groupName"
                                    className="text-lg px-3 text-gray-500 font-semibold"
                                >
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    name="groupName"
                                    className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    id="groupName"
                                    placeholder="Group Name"
                                    autoComplete="off"
                                    value={groupName}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                />
                            </div>
                            <div className="w-11/12 mx-auto rounded-md pb-2 h-44 border overflow-y-scroll scrollbar-hide flex-grow">
                                {groupMembers &&
                                    groupMembers.map((friend) => (
                                        <div className="px-2 py-2 mx-auto transition ease-out flex flex-row hover:bg-slate-100 ">
                                            <div className="my-auto pr-3">
                                                <img
                                                    src={friend.pic}
                                                    className="rounded-full w-9"
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className="my-auto w-full flex flex-row items-center">
                                                <div className="flex w-4/5">
                                                    <h1 className="font-bold text-md text-black">
                                                        {friend.firstName +
                                                            " " +
                                                            friend.lastName}
                                                    </h1>
                                                </div>
                                                {user._id.toString() ===
                                                    selectedChat.groupAdmin._id.toString() &&
                                                    friend._id.toString() !==
                                                        selectedChat.groupAdmin._id.toString() && (
                                                        <div className="flex w-1/5 items-center place-content-end">
                                                            <button
                                                                className="hover:bg-slate-300 hover:rounded-full p-1 "
                                                                onClick={(e) =>
                                                                    handleDeselectFriend(
                                                                        e,
                                                                        friend._id
                                                                    )
                                                                }
                                                            >
                                                                <HiOutlineMinusCircle
                                                                    color="red"
                                                                    size={20}
                                                                />
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {user._id ===
                                selectedChat.groupAdmin._id.toString() && (
                                <div className="w-11/12 mx-auto py-2">
                                    <label
                                        htmlFor="searchNewMembers"
                                        className="text-lg px-3 text-gray-500 font-semibold"
                                    >
                                        Search Users
                                    </label>
                                    <input
                                        type="text"
                                        name="searchNewMembers"
                                        className="form-control block w-full px-4 py-2 text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        id="groupMembers"
                                        placeholder="Search"
                                        autoComplete="off"
                                        value={searchGroupMembers}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                    />
                                </div>
                            )}
                            {user._id ===
                                selectedChat.groupAdmin._id.toString() && (
                                <div className="w-11/12 mx-auto rounded-md pb-2 h-44 border overflow-y-scroll scrollbar-hide flex-grow">
                                    {newMembers &&
                                        newMembers.map((friend) => (
                                            <div
                                                className="px-2 py-2 mx-auto rounded-md transition ease-out flex flex-row hover:bg-gray-200 "
                                                onClick={(e) =>
                                                    handleSelectFriend(
                                                        e,
                                                        friend._id
                                                    )
                                                }
                                            >
                                                <div className="my-auto pr-3 ">
                                                    <img
                                                        src={friend.pic}
                                                        className="rounded-full w-9"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className="my-auto flex flex-row">
                                                    <h1 className="font-bold text-md text-black">
                                                        {friend.firstName +
                                                            " " +
                                                            friend.lastName}
                                                    </h1>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end p-5 border-t border-solid border-slate-200 rounded-b">
                            {user._id !==
                            selectedChat.groupAdmin._id.toString() ? (
                                <button
                                    className="text-red-500 hover: background-transparent font-bold px-6 py-2 text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={(e) => {
                                        props.handleShowEditGroupModal(e);
                                    }}
                                >
                                    Close
                                </button>
                            ) : (
                                <button
                                    className="text-red-500 hover: background-transparent font-bold px-6 py-2 text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={(e) => {
                                        setSearchMatches(newMembers);
                                        setGroupMembers(selectedChat.users);
                                        props.handleShowEditGroupModal(e);
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                            {user._id ===
                                selectedChat.groupAdmin._id.toString() && (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white font-bold text-md py-2 px-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={(e) => handleSaveChanges(e)}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    );
}
