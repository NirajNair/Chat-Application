import React, { useEffect, useState } from "react";
import { UserState } from "../../../Contexts/UserContext";
import { CgProfile } from "react-icons/cg";
import { FcOk } from "react-icons/fc";
import axios from "axios";

export default function GroupModal(props) {
    const [groupMembers, setGroupMembers] = useState([]);
    const [searchMatches, setSearchMatches] = useState([]);
    const [selectedMemberMap, setSelectedMemberMap] = useState(new Map());
    const [searchGroupMembers, setSearchGroupMembers] = useState("");
    const [groupName, setGroupName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { user, chatList, setChatList, friendList, setFriendList } = UserState();

    const [pic, setPic] = useState();

    function handlePicUpload(event) {
        console.log(event);
        setPic(event);
    }

    async function getFriendList() {
        await axios
            .get(
                `http://localhost:5000/api/chat/friendList`,
                { withCredentials: true },
                {
                    "Content-type": "application/json",
                }
            )
            .then((res) => {
                console.log(res.data);
                setFriendList(res.data);
            });
    }

    useEffect(() => {
        if (friendList.length === 0) {
            getFriendList();
        }
        setSearchMatches(friendList);
    }, []);

    useEffect(() => {
        console.log("entered");
    });

    // function filterValues(chat) {
    //     let name =
    //         chat.users[0]._id !== user._id
    //             ? chat.users[0].firstName + " " + chat.users[0].lastName
    //             : chat.users[1].firstName + " " + chat.users[1].lastName;
    //     return name.includes(niraj);
    // }

    function handleChange(event) {
        event.preventDefault();
        switch (event.target.name) {
            case "groupName":
                setGroupName(event.target.value);
                break;
            case "searchGroupMembers":
                setSearchGroupMembers(event.target.value.toLowerCase());
                clearTimeout(timer);
                console.log(event.target.value.toLowerCase());
                const newTimer = setTimeout(() => {
                    let regexExp = new RegExp(
                        `${event.target.value.toLowerCase()}*`
                    );
                    let matches = friendList.filter((friend) => {
                        return regexExp.test(
                            friend.firstName.toLowerCase() +
                                friend.lastName.toLowerCase()
                        );
                    });
                    setSearchMatches(matches);
                }, 100);
                setTimer(newTimer);
                break;
            default:
                break;
        }
    }

    function handleSelectDeselect(event, key) {
        event.preventDefault();
        let localMemberMap = new Map(selectedMemberMap);
        if (localMemberMap.get(key)) {
            localMemberMap.set(key, false);
            let idx = groupMembers.indexOf(key);
            groupMembers.splice(idx, 1);
        } else {
            localMemberMap.set(key, true);
            groupMembers.push(key);
        }
        setGroupMembers(groupMembers);
        setSelectedMemberMap(localMemberMap);
        // console.log(localMemberMap, groupMembers);
    }

    async function handleCreateGroup(event) {
        event.preventDefault();
        if (groupName === "") {
            setErrorMessage("Please enter a group name");
        } else if (groupMembers.length === 0) {
            setErrorMessage("Please add group members.");
        } else {
            let group = new FormData();
            let userIdList = [];
            userIdList.push(user._id);
            groupMembers.map((member) => userIdList.push(member));
            console.log(groupMembers);
            group.append("groupName", groupName);
            group.append("users", userIdList);
            group.append("pic", pic);
            console.log(group);
            await axios
                .post(
                    `${process.env.REACT_APP_URL}/api/chat/creategroup`,
                    group,
                    { withCredentials: true },
                    {
                        "Content-type": "multipart/form-data",
                    }
                )
                .then((res) => {
                    // console.log(res.data);
                    let updatedChatList = chatList.unshift(res.data);
                    setChatList([...updatedChatList]);
                })
                .catch((err) => {
                    setErrorMessage(err);
                });
            // console.log(chatList);
            props.handleShowGroupModal(false);
        }
    }

    return (
        <div>
            <div className="justify-center items-start my-10 flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-4/5 md:1/2 my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-2xl font-semibold">
                                Create Group
                            </h3>
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
                            <div className="h-fit mx-auto w-11/12">
                                <label
                                    htmlFor="grouppic"
                                    className="text-md ml-4 uppercase text-gray-500 font-semibold"
                                >
                                    Group Picture
                                </label>
                                <input
                                    className="form-control block w-full px-4 py-3 text-md font-normal text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    type="file"
                                    onChange={(e) => {
                                        handlePicUpload(e.target.files[0]);
                                    }}
                                />
                            </div>
                            <div className="w-11/12 mx-auto pb-5">
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
                            <div className="w-11/12 mx-auto pb-2">
                                <input
                                    type="text"
                                    name="searchGroupMembers"
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
                            {/* <div className="w-11/12 mx-auto pb-5 pt-2 rounded-lg h-44 border overflow-y-scroll scrollbar-hide flex-grow">
                                {groupMembers &&
                                    groupMembers.map((friend) => (
                                        <div
                                            className="px-2 py-2 bg-slate-100 mx-auto transition ease-out flex flex-row hover:bg-gray-200 "
                                            onClick={(e) =>
                                                handleDeselectFriend(
                                                    e,
                                                    friend._id
                                                )
                                            }
                                        >
                                            <div className="my-auto pr-3">
                                                <img
                                                    src={friend.pic}
                                                    className="rounded-full w-9"
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className="my-auto w-full flex flex-row">
                                                <div className="flex w-4/5"> 
                                                    <h1 className="font-bold text-md text-black">
                                                        {friend.firstName +
                                                            " " +
                                                            friend.lastName}
                                                    </h1>
                                                </div>
                                                <div className="flex w-1/5 items-center place-content-end">
                                                    <FcOk size={25} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div> */}
                            <div className="w-11/12 mx-auto pb-5 h-44 border overflow-y-scroll scrollbar-hide flex-grow">
                                {searchMatches &&
                                    searchMatches.map((friend) => (
                                        <div
                                            className="px-2 py-2 mx-auto rounded-md transition ease-out flex flex-row hover:bg-gray-200 "
                                            onClick={(e) =>
                                                handleSelectDeselect(
                                                    e,
                                                    friend._id
                                                )
                                            }
                                        >
                                            <div className="my-auto pr-3">
                                                <img
                                                    src={friend.pic}
                                                    className="rounded-full w-9"
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className="my-auto w-full flex flex-row">
                                                <div className="flex items-center w-4/5">
                                                    <h1 className="font-bold text-md text-black">
                                                        {friend.firstName +
                                                            " " +
                                                            friend.lastName}
                                                    </h1>
                                                </div>
                                                {selectedMemberMap.get(
                                                    friend._id
                                                ) && (
                                                    <div className="flex w-1/5 items-center place-content-end">
                                                        <FcOk size={25} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-5 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 hover: background-transparent font-bold px-6 py-2 text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={(e) => {
                                    props.handleShowGroupModal(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white font-bold text-md py-2 px-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={(e) => handleCreateGroup(e)}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    );
}
