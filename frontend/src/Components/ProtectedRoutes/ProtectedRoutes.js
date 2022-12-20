import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { UserState } from "../../Contexts/UserContext";
import axios from "axios";

export default function ProtectedRoutes() {
    const { user, setUser } = UserState();
    const [isLoading, setIsLoading] = useState(true);

    const API_URL =
        process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_DEV_URL
            : process.env.REACT_APP_PROD_URL;

    useLayoutEffect(() => {

        async function getUser() {
            await axios
                .get(
                    `${API_URL}/api/user/`,
                    { withCredentials: true },
                    {
                        "Content-type": "application/json",
                    }
                )
                .then((res) => {
                    if(res.status === 200) {
                        console.log(res.data.user)
                        setUser(res.data.user);
                        setIsLoading(false);
                    }
                }).catch((err) => {
                    setIsLoading(false)
                });
        }
        if (!user) {
            getUser();
        } else {
            setIsLoading(false);
        }
    })


    return isLoading ? <div>Loading</div> : user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
}
