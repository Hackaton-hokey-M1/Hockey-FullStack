'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

import { loginService } from "@/services/authService";
import { AuthContextType, LoginCredentials } from "@/types/auth";
import { User } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (credentials: LoginCredentials) => {
    const { user } = await loginService(credentials)
    setUser(user)
  }
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}