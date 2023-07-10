import { createContext, useContext } from "react";
// Creating the user context
const SocketContext = createContext();

import io from "socket.io-client";
const socket = io("http://localhost:5000", {
    path: "/api/socket.io",
});

export default function AppStore({ children }) {

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext() {
    return useContext(SocketContext);
}
