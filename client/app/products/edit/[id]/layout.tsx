import { Suspense, type ReactNode } from 'react'

export default function EditLayout({
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