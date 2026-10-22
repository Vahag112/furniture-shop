'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'

type ToastContextType = {
    showToast: boolean
    showToastMessage: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [showToast, setShowToast] = useState(false)
    const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    function showToastMessage() {
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
        }

        setShowToast(false);

        setTimeout(() => {
            setShowToast(true);

            toastTimeout.current = setTimeout(() => {
                setShowToast(false);
            }, 1000);
        }, 10);
    }

    useEffect(() => {
        return () => {
            if (toastTimeout.current) {
                clearTimeout(toastTimeout.current)
            }
        }
    }, [])

    return (
        <ToastContext.Provider value={{ showToast, showToastMessage }}>
            {children}
            {showToast && <span className='toast'>
                Added to cart
            </span>}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }

    return context
}
