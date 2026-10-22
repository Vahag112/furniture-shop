'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import { AuthContext, baseUrl, type User } from './utility'

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                let response = await fetch(`${baseUrl}/auth/me`, {
                    credentials: 'include'
                })
                if (response.status === 401) {
                    const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
                        method: 'POST',
                        credentials: 'include'
                    })
                    if (refreshResponse.ok) {
                        response = await fetch(`${baseUrl}/auth/me`, {
                            credentials: 'include'
                        })
                    }
                }
                if (response.ok) {
                    const data: User = await response.json()
                    setUser(data)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Failed to load user', error);

            } finally {
                setLoading(false)
            }
        })()
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
