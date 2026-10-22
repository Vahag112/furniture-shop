'use client'

import Link from 'next/link'
import './Header.scss'
import { FormEvent, useContext } from 'react'
import { AuthContext, baseUrl } from '@/app/utility'
import { IoIosLogOut } from "react-icons/io";



export default function Header() {
    const { user, setUser } = useContext(AuthContext)


    async function handleButtonSubmit() {
        if (!user) {
            return;
        }

        const response = await fetch(`${baseUrl}/auth/logout`, {
            method:'POST',
            credentials: 'include'
        })

        if(response.ok){
            setUser(null)
        }else{
            alert(`${response.status}: ${response.statusText}`)
        }
    }


    return (
        <header>
            <div className="container">
                <Link href='/'><img src='/svgs/logo.svg' alt="logo" /></Link>
                <nav>
                    <ul>
                        <li><Link href='/products'>Product</Link></li>
                        <li><Link href='/'>Services</Link></li>
                        <li><Link href='/'>Article</Link></li>
                        <li><Link href='/'>About Us</Link></li>
                    </ul>
                </nav>
                <div className="item">
                    {user?.role === 'admin' && <Link href='/users-shopping'><button>See the most active customers</button></Link> }
                    {user ? (
                        <>
                            <Link href='/shopping'>
                                <img src="/svgs/bag.svg" alt="" />
                            </Link>
                            <Link href='/user'>
                                <img src={user.avatar ? `${baseUrl}${user.avatar}` : "/svgs/user.svg"} className={user.avatar ? 'avatar' : ''} alt="" />
                            </Link>
                            <button onClick={handleButtonSubmit} className='logout'><IoIosLogOut/></button>
                        </>
                    ) : (
                        <>
                            <Link href='/login'><button>Log In</button></Link>
                            <Link href='/register'>Register</Link>
                        </>
                    )}
                </div>

            </div>
        </header>
    )
}
