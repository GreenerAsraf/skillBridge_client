'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { signOut, useSession } from '@/lib/auth-client'
import { SplashLoader } from '@/components/splash-loader'

type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  status: string
  image?: string | null
}

type AuthContextValue = {
  user: SessionUser | null
  isPending: boolean
  refetch: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isPending: true,
  refetch: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, refetch } = useSession()

  const logout = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user: (session?.user as SessionUser | undefined) ?? null,
        isPending,
        refetch,
        logout,
      }}
    >
      <SplashLoader show={isPending} />
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
