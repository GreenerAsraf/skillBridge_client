'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { signOut, useSession } from '@/lib/auth-client'

type AuthContextValue = {
  user: any | null
  isPending: boolean
  setUser: (user: any | null) => void // Kept for compatibility but does nothing
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isPending: true,
  setUser: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  const logout = async () => {
    await signOut()
    window.location.href = '/login'
  }

  // To keep compatibility, we ignore manual setUser.
  return (
    <AuthContext.Provider value={{ user: session?.user || null, isPending, setUser: () => {}, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
