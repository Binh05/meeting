import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io("https://meeting-api-1web.onrender.com/");
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    return socket;
};
