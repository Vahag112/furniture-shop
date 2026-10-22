'use client'

import { FormEvent, useContext, useEffect, useState } from "react"
import { AuthContext, baseUrl } from "../utility"
import { useRouter } from "next/navigation"
import styles from '../login/Login.module.scss'

type Errors = {
    username?: {
        msg: string
    },
    password?: {
        msg: string
    },
    password2?: {
        msg: string
    }
}

export default function Register() {
    const [u, setU] = useState('')
    const [p, setP] = useState('')
    const [p2, setP2] = useState('')
    const [errors, setErrors] = useState<Errors | null>({})
    const router = useRouter()
    const [generalError, setGeneralError] = useState('')
    const { user, loading } = useContext(AuthContext)

    async function handleFormSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: u,
                password: p,
                password2: p2
            })
        })

        const data = await response.json()

        if (response.ok) {
            router.push('/')
            return
        }

        const errorData = data.message

        if (errorData?.errors) {
            setErrors(errorData.errors)
        } else {
            setGeneralError(typeof errorData == 'string' ? errorData : `${response.status}: ${response.statusText}`)
        }


    }

    useEffect(() => {
        if (!loading && user) {
            router.replace('/')
        }
    }, [user, loading, router])

    return (
        <>

            <div className={styles.login}>
                <div className={`${styles.container} container`}>
                    <h2>Register</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className={styles.item}>
                            <input type="text" placeholder="username" value={u} onChange={(evt) => setU(evt.target.value)} />
                            {errors?.username && <span className={styles.error}>{errors.username.msg}</span>}
                        </div>
                        <div className={styles.item}>
                            <input type="password" placeholder="password" value={p} onChange={(evt) => setP(evt.target.value)} />
                            {errors?.password && <span className={styles.error}>{errors.password.msg}</span>}
                        </div>
                        <div className={styles.item}>
                            <input type="password" placeholder="password" value={p2} onChange={(evt) => setP2(evt.target.value)} />
                            {errors?.password2 && <span className={styles.error}>{errors.password2.msg}</span>}
                        </div>
                        {generalError && <span>{generalError}</span>}
                        <button>Log In</button>
                    </form>
                </div>
            </div>
        </>
    )
}
