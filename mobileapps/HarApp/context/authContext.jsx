import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useWebSocket from 'react-use-websocket';
import NetInfo from '@react-native-community/netinfo';

export const AuthContext = createContext({
});

const serverIP = process.env.EXPO_PUBLIC_SERVER_IP;
const serverPort = process.env.EXPO_PUBLIC_SERVER_PORT;

export const AuthProvider = ({ children }) => {

  const [isSignedIn, setIsSignedIn] = useState('false');
  const [isOnline, setIsOnline] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);
  const [jToken, setToken] = useState('');

  const serverURL = `http://${serverIP}:${serverPort}`;
  const wsURL = `ws://${serverIP}:${serverPort}`;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(wsURL, {
    share: true,
    token: getToken,
    shouldReconnect: (closeEvent) => {
      if (isSignedIn) {
        return true;
      } else {
        return false;
      }
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const getToken = async () => {
    return await AsyncStorage.getItem('token');
  };

  const signIn = () => {
    setIsSignedIn(true);
  };

  const signOut = async () => {
    setIsSignedIn(false);
    await AsyncStorage.removeItem('isSignedIn');
    await AsyncStorage.removeItem('userID');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('token');
  };

  // Set an effect that renders a permanent way to check for internet (when the provider is in use)
  // still testing utility vs just using netinfo
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isInternetReachable);
    });

    //Internet connection listener
    NetInfo.addEventListener((state) => {
      //console.warn('called');
      //console.warn(state.isInternetReachable);
      setIsOnline(state.isInternetReachable);
    });
  }, []);

  // Effect that detects a message (for notifications) can be done here or locally in
  //components
  /*useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`)
  }, [lastJsonMessage])*/

  // How websocket would be used... may want to have a seperate
  // WS context
  /*
  export const WsConsumer = () => {
    const [ready, val, send] = useContext(AuthContext); or useAuth, pref second
  
    useEffect(() => {
      if (lastJsonMessage) {
        send("message");
      }
    }, [ready, send]);
}*/

  // if just needing to recieve data, use if (lastJsonMessage)
  const globalValues = {
    isSignedIn,
    signIn,
    signOut,
    isOnline,
    serverURL,
    wsURL,
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    getToken,
  };

  return (
    <AuthContext.Provider value={globalValues}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
