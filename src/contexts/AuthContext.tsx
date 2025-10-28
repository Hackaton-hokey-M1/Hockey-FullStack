'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { getUserService, loginService, logoutService, registerService } from "@/services/authService";
import { AuthContextType, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { User } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserService();
      if (data) {
        setUser(data.user);
      }
    }

    fetchUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user } = await loginService(credentials);
    if (user) setUser(user);
    return user;
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const { user } = await registerService(credentials);
    if (user) setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      register,
      logout,
      setUser
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}