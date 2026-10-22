import { Suspense, type ReactNode } from 'react'

export default function DetailLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <Suspense fallback={<p>Loading product...</p>}>
            {children}
        </Suspense>
    )
}