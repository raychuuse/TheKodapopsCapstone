import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../AuthProvider";

const AuthRoute = () => {
    const auth = useAuth();
    if (!auth.token) return <Navigate to="/login" />;
    return <Outlet />;
};

export default AuthRoute;
