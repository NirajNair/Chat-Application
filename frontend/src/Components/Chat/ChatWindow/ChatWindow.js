import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdSend, MdOutlineArrowBack, MdDeleteOutline } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import axios from "axios";
import { UserState } from "../../../Contexts/UserContext";
import { io } from "socket.io-client";
import EditGroupModal from "../GroupModal/EditGroupModal";

let socket, selectedChatCompare;

function Time(props) {
    const [time, setTime] = useState("");

    useLayoutEffect(() => {
        let [hour, minute] = props.date.split("T")[1].split(":");
        setTime(hour + ":" + minute);
    }, []);

    return <span className="font-light text-gray-500">{time}</span>;
}

export default function ChatWindow(props) {
    const [allChatMessages, setAllChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);

    const messageRef = useRef(null);

    const {
        user,
        selectedChat,
        setSelectedChat,
        chatList,
        setChatList,
        chatMessages,
        setChatMessages,
    } = UserState();

    useEffect(() => {
        // getAllChatMessages();
        // setAllChatMessagesCopy(allChatMessages.reverse());
        selectedChatCompare = selectedChat;
        socket = io(process.env.REACT_APP_URL);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    }, []);

    useEffect(() => {
        if (chatMessages) {
            console.log("req gets called");
            getAllChatMessages();
        }
    }, []);

    function handleChange(event) {
        event.preventDefault();
        messageRef.current.value = event.target.value;
    }

    function updateLastMessage(msg) {
        selectedChat.lastMessage[0] = msg;
        setChatList([...chatList]);
        // setSelectedChat
    }

    function updateChatList(msg) {
        let idx = chatList.indexOf(selectedChat);
        updateLastMessage(msg);
        if (idx > 0) {
            let updatedChatList = chatList;
            updatedChatList.splice(idx, 1);
            updatedChatList.unshift(selectedChat);
            setChatList([...updatedChatList]);
        }
    }

    async function handleSendMessage(event) {
        event.preventDefault();
        setIsLoading(true);
        let message = messageRef.current.value;
        if (message !== "") {
            let messageBody = {
                msg: message,
                chatId: selectedChat._id,
            };
            await axios
                .post(
                    "http://localhost:5000/api/message/send/",
                    { messageBody: messageBody },
                    { withCredentials: true },
                    {
                        "Content-type": "application/json",
                    }
                )
                .then((res) => {
                    messageRef.current.value = "";
                    allChatMessages.unshift(res.data);
                    socket.emit("new message", res.data);
                    updateChatList(res.data);
                });
        }
        setIsLoading(false);
    }

    function handleShowEditGroupModal(event) {
        event.preventDefault();
        setShowEditGroupModal(!showEditGroupModal);
    }

    async function handleDeleteChat(event) {
        event.preventDefault();
        await axios
            .get(
                `http://localhost:5000/api/message/deletechat/${selectedChat._id.toString()}`,
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    setAllChatMessages([]);
                    updateLastMessage({});
                }
            })
            .catch((err) => {
                console.log(err);
            });
        console.log("exit");
    }

    async function getAllChatMessages() {
        setIsLoading(true);
        if (selectedChat) {
            await axios
                .get(
                    `http://localhost:5000/api/message/${selectedChat._id}`,
                    { withCredentials: true },
                    {
                        "Content-type": "application/json",
                    }
                )
                .then((res) => {
                    setChatMessages(res.data.reverse())
                    setAllChatMessages(res.data.reverse());
                    console.log(res.data.reverse());
                })
                .catch((err) => {
                    console.log(err);
                });
            socket.emit("join chat", selectedChat._id);
        }
        setIsLoading(false);
    }

    
    useEffect(() => {
        function addMessage(newMessage) {
            if (allChatMessages[0] &&
                newMessage._id.toString() !==
                allChatMessages[0]._id.toString()
            ) {
                allChatMessages.unshift(newMessage);
                updateChatList(newMessage);
            }
        }
        socket.on("message recieved", (newMessage) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessage.chat._id
            ) {
                //give notification
            } else {
                addMessage(newMessage);
            }
        });

    });

    return (
        <div className="flex flex-col h-full">
            <div className="flex shadow-md h-14">
                <div className="flex flex-row items-center px-1 w-full">
                    <div className="flex px-1 w-fit">
                        <button
                            className="hover:bg-slate-100 hover:rounded-full p-1"
                            onClick={(e) => setSelectedChat()}
                        >
                            <MdOutlineArrowBack color="gray" size={25} />
                        </button>
                    </div>
                    <div className=" w-4/5 flex flex-row">
                        <div className="flex px-1">
                            <img
                                src={
                                    selectedChat.groupChat
                                        ? selectedChat.groupPic
                                        : selectedChat.users[0]._id !== user._id
                                        ? selectedChat.users[0].pic
                                        : selectedChat.users[1].pic
                                }
                                className="rounded-full w-9"
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex px-1 py-1">
                            <p className="text-black font-semibold">
                                {selectedChat.groupChat
                                    ? selectedChat.chatName
                                    : selectedChat.users[0]._id !== user._id
                                    ? selectedChat.users[0].firstName +
                                      " " +
                                      selectedChat.users[0].lastName
                                    : selectedChat.users[1].firstName +
                                      " " +
                                      selectedChat.users[1].lastName}
                            </p>
                        </div>
                    </div>
                    <div className="w-1/5 flex place-content-end items-center">
                        <div className="px-2">
                            {selectedChat.groupChat ? (
                                <button
                                    className="my-auto hover:bg-slate-100 hover:rounded-full p-1"
                                    onClick={(e) => handleShowEditGroupModal(e)}
                                    // onBlur={(e) => handleShowEditGroupModal(e)}
                                >
                                    <RiInformationLine
                                        color="black"
                                        size={23}
                                    />
                                </button>
                            ) : (
                                <button
                                    className="hover:bg-slate-100 hover:rounded-full p-1"
                                    onClick={(e) => handleDeleteChat(e)}
                                >
                                    <MdDeleteOutline color="red" size={23} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse relative overflow-y-scroll scrollbar-hide flex-grow h-96">
                {allChatMessages &&
                    allChatMessages.map((message, index, arr) => {
                        let [year, month, day] = message.createdAt
                            .toString()
                            .split("T")[0]
                            .split("-");
                        return (
                            <div className="flex flex-col">
                                <div className="inline-flex justify-center text-black font-medium font-semibold text-sm py-1">
                                    {index === allChatMessages.length - 1 ? (
                                        <span>
                                            {day + "/" + month + "/" + year}
                                        </span>
                                    ) : (
                                        <span>
                                            {index + 1 <
                                                allChatMessages.length - 1 &&
                                                arr[index + 1].createdAt
                                                    .toString()
                                                    .split("T")[0] !==
                                                    message.createdAt
                                                        .toString()
                                                        .split("T")[0] &&
                                                day + "/" + month + "/" + year}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={
                                        "w-full flex   " +
                                        (message.sender._id.toString() ===
                                        user._id.toString()
                                            ? "justify-end"
                                            : "justify-start")
                                    }
                                >
                                    <div
                                        className="px-2 flex flex-col max-w-md"
                                        key={message._id}
                                    >
                                        {selectedChat.groupChat &&
                                            message.sender._id.toString() !==
                                                user._id.toString() && (
                                                <div className="pl-1">
                                                    <p className="text-black font-normal">
                                                        {message.sender
                                                            .firstName +
                                                            " " +
                                                            message.sender
                                                                .lastName}
                                                    </p>
                                                </div>
                                            )}
                                        <div
                                            className={
                                                "flex " +
                                                (message.sender._id === user._id
                                                    ? "justify-end"
                                                    : "justify-start")
                                            }
                                        >
                                            <div
                                                className={
                                                    "py-2 px-5 rounded-3xl h-fit  flex " +
                                                    (message.sender._id ===
                                                    user._id
                                                        ? "bg-blue-500 text-white flex rounded-tr-none"
                                                        : "bg-slate-300 text-black rounded-tl-none ")
                                                }
                                            >
                                                <span className="block m-auto">
                                                    {message.msg}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                message.sender._id === user._id
                                                    ? ""
                                                    : "w-fit"
                                            }
                                        >
                                            <div className="text-xs font-light flex justify-end px-2">
                                                <Time
                                                    date={message.createdAt}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {selectedChat && (
                <div className="bottom-0 inset-x-0 ">
                    <div className="py-3 ">
                        <form className="flex flex-row ">
                            <div className="w-full relative pl-2 mt-auto">
                                <input
                                    type="text"
                                    name="messsage"
                                    className="form-control block w-full px-4 py-1 text-md font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-full transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    ref={messageRef}
                                    id="message"
                                    placeholder="Enter text"
                                    autoComplete="off"
                                    // ref={messageRef}
                                    // value={message}
                                    onChange={(e) => handleChange(e)}
                                    // onFocus={(e) => handleFocus(e)}
                                    // onBlur={(e) => handleFocus(e)}
                                />
                            </div>
                            <div className="w-fit px-2 ">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white rounded-full
                                            p-2"
                                    onClick={(e) => handleSendMessage(e)}
                                >
                                    <MdSend size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditGroupModal && (
                <EditGroupModal
                    handleShowEditGroupModal={handleShowEditGroupModal}
                />
            )}
        </div>
    );
}
