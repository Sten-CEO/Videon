'use client'

import { createContext, useContext, ReactNode } from 'react'

interface UserContextType {
  userId: string | null
  userEmail: string | null
  userFullName: string | null
}

const UserContext = createContext<UserContextType>({
  userId: null,
  userEmail: null,
  userFullName: null,
})

export function useUser() {
  return useContext(UserContext)
}

// Generate a storage key with user ID prefix
export function getUserStorageKey(baseKey: string, userId: string | null): string {
  if (!userId) return baseKey
  return `${baseKey}_${userId}`
}

interface UserProviderProps {
  children: ReactNode
  user: {
    id?: string
    email?: string
    fullName?: string
  } | null
}

export function UserProvider({ children, user }: UserProviderProps) {
  return (
    <UserContext.Provider
      value={{
        userId: user?.id || null,
        userEmail: user?.email || null,
        userFullName: user?.fullName || null,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
