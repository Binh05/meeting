"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/authContext";
import Image from "next/image";
import loginImage from "@/assets/images/undraw_personal-text_login.svg";
import Login from "@/components/auth/login-form";
import SignUp from "@/components/auth/sign-up";

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login();
  };
  return (
    <div className="bg-bg grid min-h-screen place-content-center">
      <div className="flex min-h-[41rem] max-w-[68rem] shadow-[0px_0px_1rem_rgb(0,0,0,0.1)] items-center gap-8 rounded-2xl bg-white p-12">
        <div className="hidden basis-[50%] lg:block">
          <Image className="w-full" src={loginImage} alt="image login" />
        </div>
        <Tabs defaultValue="signIn" className="h-full lg:basis-[50%]">
          <TabsList className="w-full">
            <TabsTrigger value="signIn" className="cursor-pointer">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signUp" className="cursor-pointer">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signIn" className="mt-8">
            <Login onSubmit={handleLogIn} />
          </TabsContent>
          <TabsContent value="signUp">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
