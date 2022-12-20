import "./App.css";
import React from "react";
import { BrowserRouter as Router,Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import Chat from "./Components/Chat/Chat";
import Profile from "./Components/Profile/Profile";
import ChatProvider from "./Contexts/UserContext";

function App() {
    return (
        <ChatProvider>
            <Routes>
                <Route element={<ProtectedRoutes />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route exact path="/" element={<Chat />} />
                </Route>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </ChatProvider>
    );
}

export default App;
