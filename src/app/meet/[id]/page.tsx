"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Video, Mic, Phone } from "lucide-react";

export default function Page() {
    const { logout } = useAuth();
    const navigate = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoEnable, setVideoEnable] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const handleVideo = () => {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        if (!stream) throw new Error("Not stream");
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnable(!videoTrack.enabled);
    };

    const handleLogout = async () => {
        // console.log("success logout");
        // await logout();

        navigate.push("/");
    };

    return (
        <div className="bg-bg-vid grid h-screen w-full grid-cols-1 grid-rows-[1fr_auto] justify-center px-5 pt-8">
            <div className="flex-1 overflow-hidden rounded-2xl">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="bg-Border-vid mx-auto h-full object-cover"
                />
            </div>
            <div className="relative mt-3 flex w-full items-center py-4">
                <div className="mx-auto space-x-4">
                    <ButtonVideo onClick={handleVideo}>
                        <Mic />
                    </ButtonVideo>
                    <ButtonVideo>
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
    ...buttonProps
}: {
    children: React.ReactNode;
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
