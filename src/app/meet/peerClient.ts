"use client";

import Peer from "peerjs";

export const createPeer = () => {
    return new Peer({
        host: "localhost",
        port: 9000,
        path: "/peerjs/peerjs",
    });
};
