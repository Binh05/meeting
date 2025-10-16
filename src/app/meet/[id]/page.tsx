"use client";

import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Video, Mic, Phone } from "lucide-react";
import { createPeer } from "../peerClient";
import Stream from "stream";

const constraints = {
    video: {
        width: { ideal: 1920 }, // Full HD
        height: { ideal: 1080 },
        facingMode: "user",
    },
};

export default function Page() {
    const navigate = useRouter();
    const streamRef = useRef<MediaStream | null>(null);
    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

    const socket = useSocket();
    const peerId = useRef<any>(null);
    const roomId = useParams();

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
        }
    };

    useEffect(() => {
        let peerInstance: any;

        (async () => {
            await openCamera();

            peerInstance = createPeer();

            peerInstance.on("open", (id: string) => {
                peerId.current = id;
                socket?.emit("join-room", roomId, id);
            });

            peerInstance.on("call", (call: any) => {
                if (streamRef.current) {
                    call.answer(streamRef.current);
                }
                call.on("stream", (stream: MediaStream) => {
                    if (remoteVideo.current) {
                        remoteVideo.current.srcObject = stream;
                    }
                });
            });

            socket?.on("user-connect", (userId: string) => {
                if (streamRef.current) {
                    const call2 = peerInstance.call(userId, streamRef.current);
                    call2.on("stream", (remoteStream: MediaStream) => {
                        if (remoteVideo.current) {
                            remoteVideo.current.srcObject = remoteStream;
                        }
                    });
                }
            });
        })();

        return () => {
            peerInstance?.destroy();
            socket?.off("user-connect");
        };
    }, []);

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
                        "bg-Border-vid mx-auto h-full -scale-x-100 transform object-cover transition-all duration-300",
                        !true && "bg-Border-vid h-full w-full rounded-2xl",
                    )}
                />
                <video
                    ref={remoteVideo}
                    className="bg-Border-vid h-full w-full"
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
