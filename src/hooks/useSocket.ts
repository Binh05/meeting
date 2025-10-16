import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io("http://localhost:5000");
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    return socket;
};
