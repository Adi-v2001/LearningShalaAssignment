/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContext {
  login: (userData: { email: string; password: string }) => Promise<void>;
  isLoggedIn: boolean;
  logout: () => void;
  loading: boolean
}

const authContext = createContext<AuthContext>({
  login: async (_userData: { email: string; password: string }) => {},
  isLoggedIn: false,
  logout: () => {},
  loading: false
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("learningShalaJWT");
    if (!token) {
      router.push("/");
    } else {
      setIsLoggedIn(true)
    }
  }, []);
  
  const login = async (userData: { email: string; password: string }) => {
    setLoading(true)
    const res = await axios.post(
      '/api/Login',
      userData
    );
    if (res.status === 200) {
      localStorage.setItem("learningShalaJWT", res.data.token);
      setIsLoggedIn(true)
      toast({
        title: res.data.statusText,
        description: `Welcome back ${res.data.userName}`
      });
      router.push("/dashboard");
    } else {
      toast({
        title: res.data.statusText,
        variant: "destructive",
      });
    }
    setLoading(false)
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('learningShalaJWT')
    router.push('/')
    toast({
      title: 'Logged Out'
    })
  }

  return (
    <authContext.Provider value={{ login, isLoggedIn, logout, loading }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
