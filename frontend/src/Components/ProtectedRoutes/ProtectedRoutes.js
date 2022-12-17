import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserState } from "../../Contexts/UserContext";
import axios from "axios";

export default function ProtectedRoutes() {
    const { user, setUser } = UserState();
    const [isLoading, setIsLoading] = useState(false);

    async function getUser() {
        await axios.get(
            "http://localhost:5000/api/user/",
            { withCredentials: true },
            {
                "Content-type": "application/json",
            }
        ).then((res) => {
            setUser(res.data.user);
            
        });
    }

    useLayoutEffect(() => {
        console.log("loading")
        setIsLoading(true);
        if(!user) {
            getUser();
        }
        setIsLoading(false);
    }, [user])

    return  isLoading ? <div>Loading</div> : ( user ? <Outlet /> : <Navigate to="/login" />) }
