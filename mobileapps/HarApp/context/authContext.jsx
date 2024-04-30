import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from 'react-native';
import useWebSocket from 'react-use-websocket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);
  const ws = useRef(null);

  const serverURL = "localhost:8080";
  const wsURL = "ws://localhost:8000"

  const signIn = () => {
    setIsSignedIn(true);
  };

  const signOut = async () => {
    setIsSignedIn(false);
    await AsyncStorage.removeItem('isSignedIn');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('token');
  };

  // Set an effect that renders a permanent way to check for internet (when the provider is in use)
  useEffect(() => {
    NetInfo.fetch().then((state) => {
        
        setIsOnline(state.isInternetReachable);
    });

    //Internet connection listener
    NetInfo.addEventListener((state) => {

      console.warn('called');
      console.warn(state.isInternetReachable);
      setIsOnline(state.isInternetReachable);
    });
  }, []);

  // Effect for managing socket, put here but websocket is primarily only used
  // in main, though same for netinfo.
  useEffect(() => {
    const socket = new WebSocket(wsURL)

    socket.onopen = () => setIsReady(true)
    socket.onclose = () => setIsReady(false)
    socket.onmessage = (event) => setVal(event.data)

    ws.current = socket

    return () => {
      socket.close()
    }
  }, [])

  const ret = [isReady, val, ws.current?.send.bind(ws.current)]

  // How websocket would be used... may want to have a seperate
  // WS context
  /*
  export const WsConsumer = () => {
    const [ready, val, send] = useContext(AuthContext/ WSContext); 
  
    useEffect(() => {
      if (ready) {
        send("message");
      }
    }, [ready, send]);
}*/
  const globalValues = {
    isSignedIn,
    signIn,
    signOut,
    isOnline,
    serverURL,
    wsURL,
    ret
  };

  return (
    <AuthContext.Provider value={globalValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);