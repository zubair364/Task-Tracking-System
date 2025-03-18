"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  getUserFromCookies,
} from "@/app/actions/auth-actions";

type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    password_confirm: string,
    first_name: string,
    last_name: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load user data from cookies on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { user } = await getUserFromCookies();
        setUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Redirect logic based on authentication state
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/login", "/register"];
      const isPublicPath = publicPaths.includes(pathname);

      if (!user && !isPublicPath) {
        router.push("/login");
      } else if (user && isPublicPath) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const result = await loginAction(email, password);

      if (result.success && result.user) {
        setUser(result.user);
        toast.success("Login successful", {
          description: "Welcome back!",
        });
        router.push("/dashboard");
        return true;
      } else {
        toast.error("Login failed", {
          description: result.message || "Please check your credentials",
        });
        return false;
      }
    } catch (error) {
      toast.error("Login failed", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    password_confirm: string,
    first_name: string,
    last_name: string
  ) => {
    setIsLoading(true);

    try {
      const result = await registerAction(
        username,
        email,
        password,
        password_confirm,
        first_name,
        last_name
      );

      if (result.success) {
        toast.success("Registration successful", {
          description: result.message || "Please log in with your new account",
        });
        router.push("/login");
        return true;
      } else {
        toast.error("Registration failed", {
          description: result.message || "Please try again",
        });
        return false;
      }
    } catch (error) {
      toast.error("Registration failed", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAction();
      setUser(null);
      toast.success("Logged out", {
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed", {
        description: "There was an error logging out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
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
