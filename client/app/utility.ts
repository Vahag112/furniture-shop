'use client'

import { createContext } from "react"

export const baseUrl = 'http://localhost:5555'

export type User = {
    username: string
    id: string
    avatar: string | null
    role: string
}

type AuthContextType = {
    loading: boolean
    user: User | null
    setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType>({
    loading: true,
    user: null,
    setUser: () => {}
})