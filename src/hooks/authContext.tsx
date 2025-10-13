"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_PATH = "http://localhost:5000/v1";

const decodeJWT = (token: string) => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    throw new Error("invalid or don't found token");
  }
};

interface AuthType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(null);
  const router = useRouter();

  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_PATH}/auth/refreshtoken`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("invalid or dont found refresh token");

      const data = await res.json();

      const token = data.accessToken;
      setToken(token);
      localStorage.setItem("access_token", token);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_PATH}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "binh", password: "123" }),
        credentials: "include",
      });

      const data = await res.json();
      const accToken = data.tokens.accessToken;
      setToken(accToken);
      localStorage.setItem("access_token", accToken);
      router.push("/chat");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_PATH}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("access_token");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("use Auth must be within authProvider");
  return ctx;
};
