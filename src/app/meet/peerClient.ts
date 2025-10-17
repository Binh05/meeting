"use client";

import Peer from "peerjs";

export const createPeer = () => {
    return new Peer({
        config: {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
            ],
        },
    });
};
