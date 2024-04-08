import {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import loginUser from "./api/loginUser";
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(Cookies.get('user'));
    const [token, setToken] = useState(Cookies.get('token'));
    const navigate = useNavigate();

    const loginAction = (data) => {
        loginUser(data)
            .then(responseData => {
                setUser(responseData.user);
                setToken(responseData.token);
                Cookies.set('token', token);
                Cookies.set('user', user);
                navigate("/");
            })
            .catch(err => {
                console.error(err);
            });
    };

    const logOut = () => {
        setUser(null);
        setToken(null);
        navigate("/login");
        Cookies.remove('token');
        Cookies.remove('user');
    };

    return (
        <AuthContext.Provider value={{token, user, loginAction, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
