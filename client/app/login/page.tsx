'use client'

import { FormEvent, useContext, useEffect, useState } from "react"
import { AuthContext, baseUrl } from "../utility"
import { useRouter } from "next/navigation"
import styles from './Login.module.scss'

type Errors = { 
    username?: {
        msg: string
    },
     password?: {
        msg: string
    }
}

export default function Login() {
    const [u, setU] = useState('')
    const [p, setP] = useState('')
    const [errors, setErrors] = useState<Errors | null>({})
    const router = useRouter()
    const [generalError, setGeneralError] = useState('')
    const {setUser, user, loading} = useContext(AuthContext)

    async function handleFormSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: u,
                password: p
            })
        })

        const data = await response.json()

        if(response.ok){
            setUser(data)
            router.push('/')
            return
        }

        const errorData = data.message

        if(errorData?.errors){
            setErrors(errorData.errors)
        }else{
            setGeneralError(typeof errorData =='string' ? errorData : `${response.status}: ${response.statusText}`)
        }


    }

        useEffect(() => {
        if (!loading && user) {
            router.replace('/')
        }
    }, [user, loading, router])


    

  return (
    <div className={styles.login}>
        <div className={`${styles.container} container`}>
            <h2>Log In</h2>
            <form onSubmit={handleFormSubmit}>
                <div className={styles.item}>
                    <input type="text" placeholder="username" value={u} onChange={(evt) => setU(evt.target.value)}/>
                   {errors?.username && <span className={styles.error}>{errors.username.msg}</span>}
                </div>
                <div className={styles.item}>
                    <input type="password" placeholder="password" value={p} onChange={(evt) => setP(evt.target.value)}/>
                   {errors?.password && <span className={styles.error}>{errors.password.msg}</span>}
                </div>
                {generalError && <span>{generalError}</span> }
                <button>Log In</button>
            </form>
        </div>
    </div>
  )
}
