import {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "./api/users";
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(Cookies.get('user'));
    const [token, setToken] = useState(Cookies.get('token'));
    const navigate = useNavigate();

    const onLogin = (user, token) => {
        setUser(user);
        setToken(token);
        Cookies.set('token', token);
        Cookies.set('user', user);
        Cookies.set('firstName', user.firstName)
        navigate("/");
    };

    const logOut = () => {
        setUser(null);
        setToken(null);
        navigate("/login");
        Cookies.remove('token');
        Cookies.remove('user');
        Cookies.remove('firstName', user.firstName)
    };

    return (
        <AuthContext.Provider value={{token, user, onLogin, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
