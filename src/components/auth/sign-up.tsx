"use client";

import { InputForm } from "@/components/ui/input-form";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  return (
    <div className="mt-4">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-4xl font-bold">Create Your Account</h1>
      </div>
      <form className="space-y-4">
        <InputForm id="Username" placeholder="Enter your username ..." />
        <InputForm id="Email" placeholder="Enter your email ..." />
        <InputForm
          id="Password"
          type="password"
          placeholder="Enter your password ..."
        />
        <InputForm id="Confirm Password" placeholder="Confirm your password" />
        <Button type="submit" className="mt-4 w-full cursor-pointer py-5">
          Sign Up
        </Button>
      </form>
      <p className="mt-4 text-center text-xs">
        By sign up, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
