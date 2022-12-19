import React from "react";
import { UserState } from "../../../Contexts/UserContext";

export default function Messages(props) {
    const { user } = UserState();
    return (
        <div>
            {props.allChatMessages.reverse().map((message) => (
                <div className="p-1 flex flex-col pb-14 py-5" key={message._id}>
                    <div
                        className={
                            "p-2 w-fit rounded-2xl " +
                            (message.sender._id === user._id
                                ? "bg-blue-500 text-white rounded-tr-none absolute right-2"
                                : "bg-slate-100 text-black rounded-tl-none absolute left-2")
                        }
                    >
                        {message.msg}
                    </div>
                    <div
                        className={
                            "text-xs font-light " +
                            (message.sender._id === user._id
                                ? "absolute right-5 mt-10"
                                : "absolute left-5 mt-10")
                        }
                    >
                        {message.createdAt}
                    </div>
                </div>
            ))}
        </div>
    );
}
