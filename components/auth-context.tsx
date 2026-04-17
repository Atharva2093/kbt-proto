"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { logout as firebaseLogout } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const logout = async () => {
    try {
      await firebaseLogout()
      setUser(null)
      setToken(null)
      router.push("/")
      console.log("[AUTH_CONTEXT] Logout successful, redirected to home");
    } catch (error) {
      console.error("[AUTH_CONTEXT] Logout error:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AUTH_CONTEXT] State changed:", user ? user.email : "Logged out");
      
      if (user) {
        setUser(user)
        const idToken = await user.getIdToken()
        setToken(idToken)
      } else {
        setUser(null)
        setToken(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, token, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
