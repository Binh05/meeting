"use client";

import { InputForm } from "@/components/ui//input-form";
import { Button } from "@/components/ui/button";
import React from "react";

interface SignInProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export default function Login({ onSubmit }: SignInProps) {
  return (
    <div className="mt-4">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-sm">
          Enter your email and password to access your account
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <InputForm id="Email" name="email" placeholder="Enter your email ..." />
        <InputForm
          id="Password"
          name="password"
          type="password"
          placeholder="Enter your password ..."
        />
        <Button type="submit" className="mt-4 w-full cursor-pointer py-5">
          Sign In
        </Button>
      </form>
      <p className="mt-4 text-center text-xs">
        By logging in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
