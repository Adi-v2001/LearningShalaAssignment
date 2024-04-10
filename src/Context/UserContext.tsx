/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { toast } from "@/components/ui/use-toast";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContext {
  login: (userData: { email: string; password: string }) => Promise<void>;
  isLoggedIn: boolean;
  logout: () => void;
  loading: boolean;
  user: User | null
}

const authContext = createContext<AuthContext>({
  login: async (_userData: { email: string; password: string }) => {},
  isLoggedIn: false,
  logout: () => {},
  loading: false,
  user: null
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getUser = async (userId: string) => {
    try {
      const res = await axios.get(`/api/GetUser?userId=${userId}`)
      setUser(res.data.user)
    } catch (err) {
      console.log('An error occured', err)
    }
  }

  useEffect(() => {
    const refetchUser = async () => {

      const token = localStorage.getItem("learningShalaJWT");
      const userId = localStorage.getItem("learningShalaUserId")
      if (!token || !userId) {
        logout()
      } else {
        await getUser(userId)
        setIsLoggedIn(true)
      }
    }
    refetchUser().catch(err => console.log('An error occured', err))
  }, []);
  
  const login = async (userData: { email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await axios.post(
        '/api/Login',
        userData
      );
      if (res.status === 200) {
        localStorage.setItem("learningShalaJWT", res.data.token);
        localStorage.setItem("learningShalaUserId", res.data.user.id);
        setIsLoggedIn(true)
        setUser(res.data.user)
        toast({
          title: res.data.statusText,
          description: `Welcome back ${res.data.user.name}`
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
        toast({
          title: error.response.data.statusText,
          variant: "destructive",
        });
    }
    setLoading(false)
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('learningShalaJWT')
    localStorage.removeItem('learningShalaUserId')
    router.push('/')
    setUser(null)
    toast({
      title: 'Logged Out'
    })
  }

  return (
    <authContext.Provider value={{ login, isLoggedIn, logout, loading, user }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
