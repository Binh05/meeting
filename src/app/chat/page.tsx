"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";

export default function Page() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    console.log("success logout");
    await logout();
  };

  return (
    <div className="min-h-screen grid place-content-center">
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
