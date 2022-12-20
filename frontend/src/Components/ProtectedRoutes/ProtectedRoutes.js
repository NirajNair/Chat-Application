import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { UserState } from "../../Contexts/UserContext";
import axios from "axios";

export default function ProtectedRoutes() {
    const { user, setUser } = UserState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            await axios
                .get(
                    `${process.env.REACT_APP_URL}/api/user/`,
                    { withCredentials: true },
                    {
                        "Content-type": "application/json",
                    }
                )
                .then((res) => {
                    setUser(res.data.user);
                });
        }
        if (!user) {
            getUser();
        }
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    return isLoading ? (
        <div>Loading</div>
    ) : user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
}
