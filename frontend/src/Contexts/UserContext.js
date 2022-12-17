import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [chatList, setChatList] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [friendList, setFriendList] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                chatList,
                setChatList,
                selectedChat,
                setSelectedChat,
                friendList,
                setFriendList,
                chatMessages, 
                setChatMessages
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const UserState = () => {
    return useContext(UserContext);
};

export default UserProvider;
