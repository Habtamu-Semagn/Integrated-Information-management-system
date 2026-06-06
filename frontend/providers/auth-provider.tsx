"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, User } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.users.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Auth error:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle protected routes
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
      const isDashboardPage = pathname.startsWith("/dashboard");

      if (isDashboardPage && !user) {
        router.push("/login");
      } else if (isAuthPage && user) {
        // Only redirect if we're on the root login/register pages
        // to avoid redirect loops if the user is already being redirected
        if (pathname === "/login" || pathname === "/register") {
          router.push("/dashboard/" + user.role);
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    setUser(userData);
    // Navigation will be handled by the login page or the protected route effect
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
