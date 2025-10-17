"use client";

import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Video, Mic, Phone } from "lucide-react";
import { createPeer } from "../peerClient";
import Peer from "peerjs";

const constraints = {
    video: {
        width: { ideal: 1920 }, // Full HD
        height: { ideal: 1080 },
        facingMode: "user",
    },
    audio: true,
};

export default function Page() {
    const navigate = useRouter();
    const streamRef = useRef<MediaStream | null>(null);
    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

    const socket = useSocket();
    const peer = useRef<Peer | null>(null);
    const peerId = useRef<string | null>(null);
    const roomId = useParams().id;

    const openCamera = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia(constraints);

            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }

            streamRef.current = stream;
            setIsCameraOn(true);
        } catch (error) {
            console.error(error);
        } finally {
            console.log("local video", localVideo.current?.srcObject);
        }
    };

    const initialized = useRef(false);

    useEffect(() => {
        (async () => {
            if (initialized.current) return;
            initialized.current = true;

            if (localVideo.current?.srcObject) return;
            await openCamera();
        })();
    }, []);

    useEffect(() => {
        try {
            socket?.emit("user-connect", true);
            socket?.on("serverResponse", (msg) => console.log(msg));

            peer.current = createPeer();
            peer.current.on("open", (id) => {
                peerId.current = id;
                console.log("peer id current: ", peerId.current);
                socket?.emit("join-room", roomId, id);
            });

            socket!.on("user-connected", (userId) => {
                console.log("user ID: ", userId);
                peer.current!.call(userId, streamRef.current!);
                socket?.emit("responsePeerId", roomId, peerId.current);
            });

            socket?.on("old-user", (userId) => {
                peer.current?.call(userId, streamRef.current!);
            });

            peer.current.on("call", (call) => {
                call.answer(streamRef.current!);
                call.on("stream", (userStream) => {
                    if (remoteVideo.current) {
                        remoteVideo.current.srcObject = userStream;
                        console.log(
                            "remote video",
                            remoteVideo.current?.srcObject,
                        );
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
        return () => {
            socket?.off("client-connect");
            socket?.off("serverResponse");
            socket?.off("user-connect");
        };
    }, [socket]);

    const closeCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        if (localVideo.current) {
            localVideo.current.srcObject = null;
        }
        streamRef.current = null;
        setIsCameraOn(false);
    };

    const toggleVideo = async () => {
        if (!isCameraOn) {
            await openCamera();
        } else {
            closeCamera();
        }
    };

    const handleLogout = async () => {
        try {
            closeCamera();
        } finally {
            navigate.push("/");
        }
    };

    return (
        <div className="bg-bg-vid grid h-screen w-full grid-cols-1 grid-rows-[1fr_auto] justify-center px-5 pt-4">
            <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
                <video
                    ref={localVideo}
                    autoPlay
                    playsInline
                    muted
                    className={clsx(
                        "bg-Border-vid mx-auto h-full w-full -scale-x-100 transform object-cover transition-all duration-300",
                        !isCameraOn &&
                            "bg-Border-vid h-full w-full rounded-2xl",
                    )}
                />
                <video
                    ref={remoteVideo}
                    autoPlay
                    playsInline
                    muted
                    className="bg-Border-vid h-full w-full object-cover"
                />
            </div>
            <div className="relative flex w-full items-center py-4">
                <div className="mx-auto space-x-4">
                    <ButtonVideo>
                        <Mic />
                    </ButtonVideo>
                    <ButtonVideo onClick={toggleVideo}>
                        <Video />
                    </ButtonVideo>
                </div>

                <Button onClick={handleLogout} className="absolute right-0">
                    <Phone />
                </Button>
            </div>
        </div>
    );
}

function ButtonVideo({
    children,
    toggle = true,
    ...buttonProps
}: {
    children: React.ReactNode;
    toggle?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...buttonProps}
            className="bg-Border-vid cursor-pointer rounded-4xl px-6 py-4 text-white"
        >
            {children}
        </button>
    );
}
