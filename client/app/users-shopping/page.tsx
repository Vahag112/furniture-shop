'use client'
import { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext, baseUrl } from '../utility'
import './usersShopping.scss'
import { useRouter } from 'next/navigation'


type ShoppingItem = {
    productId: number
    title: string
    price: string
    quantity: number
}

type UsersShopping = {
    id: number
    username: string
    productsCount: number
    totalPrice: number
    shopping: ShoppingItem[]
}


export default function UsersShopping() {

    const [activeUser, setActiveUser] = useState<number[]>([])
    const [list, setList] = useState<UsersShopping[]>([])
    const { user, loading } = useContext(AuthContext)
    const router = useRouter()


    useEffect(() => {

        if (loading) {
            return;
        }

        if (!user || user?.role !== 'admin') {
            router.replace('/')
            return;
        }
        (async () => {
            const response = await fetch(`${baseUrl}/admin/users-shopping`, {
                credentials: 'include',

            })
            if (response.ok) {
                const data = await response.json()
                console.log(data);

                setList(data)
            }
            else {
                alert(`${response.status}: ${response.statusText}`)
            }
        })()

    }, [user, loading, router])


    return (
        <div className='users_shopping'>
            <div className="container">
                {
                    list.map(elem => (
                        <div className='content' key={elem.id}>
                            <div className="item">
                                <div className="box">
                                    <label>Username</label>
                                    <h3>{elem.username}</h3>
                                </div>
                                <div className="box">
                                    <label>Products count</label>
                                    <p>{elem.productsCount}</p>
                                </div>

                                <div className="box">
                                    <label>Total price</label>
                                    <span>${elem.totalPrice}</span>
                                </div>

                                <div className="box">
                                    <label>Shoppings</label>
                                    {!elem.productsCount ?
                                        <span>-</span>
                                        :
                                        (
                                            <button onClick={() => {
                                                setActiveUser(prev =>
                                                    prev.includes(elem.id)
                                                        ? prev.filter(id => id !== elem.id)
                                                        : [...prev, elem.id]
                                                )
                                            }}>See</button>
                                        )
                                    }
                                </div>
                            </div>
                            <div className={activeUser?.includes(elem.id) ? 'shopping active' : 'shopping'}>
                                {elem.shopping.map(item => (
                                    <div className="box" key={item.productId}>
                                        <h3>{item.title}</h3>
                                        <p>Price: ${item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}
