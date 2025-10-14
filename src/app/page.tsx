"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Keyboard } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

function Home() {
    const router = useRouter();
    const [code, setCode] = useState<string>("");

    const createNewMeet = () => {
        const newMeetingId = uuidv4();
        router.push(`/meet/${newMeetingId}`);
    };

    const handleLogIn = () => {
        router.push("/login");
    };

    return (
        <div className="bg-bg min-h-screen w-full pt-8">
            <header className="mx-auto mb-16 flex w-[80%] max-w-[75rem] items-center justify-between rounded-lg bg-white px-8 py-3 shadow-[0_0_2rem_rgba(0,0,0,0.1)]">
                <p className="text-xl font-bold uppercase">Meeting</p>
                <ul className="flex gap-6">
                    <li>
                        <Link href={"/chat"}>Home</Link>
                    </li>
                    <li>
                        <Link href={"/chat"}>Meeting Room</Link>
                    </li>
                </ul>
                <div className="space-x-3">
                    <Button variant={"outline"} onClick={handleLogIn}>
                        Log In
                    </Button>
                    <Button className="bg-primary-own text-white">
                        Sign up
                    </Button>
                </div>
            </header>
            <main>
                <div className="mx-auto mt-20 max-w-[60%] space-y-8 text-center">
                    <h1 className="text-6xl font-bold">
                        Video calls and meetings for everyone
                    </h1>
                    <p className="text-lg">
                        Connect, collaborate, and celebrate from anywhere with
                        Web Meet
                    </p>
                    <div className="mt-16 flex items-center justify-center gap-4 text-lg">
                        <Button
                            onClick={createNewMeet}
                            className="flex items-center px-12 py-6 text-lg"
                        >
                            <Plus className="size-6" />
                            New meeting
                        </Button>
                        <InputGroup className="max-w-[17rem] border-2 border-black py-6">
                            <InputGroupInput
                                placeholder="Enter a code"
                                className="text-lg"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <InputGroupAddon>
                                <Keyboard className="size-6" />
                            </InputGroupAddon>
                        </InputGroup>
                        <Button
                            disabled={!code.trim()}
                            className="text-primary bg-transparent py-6 text-xl hover:rounded-4xl hover:text-white"
                        >
                            Join
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
