'use client'

import './DetailPage.scss'
import type { ProductsList } from '../components/products/Products'
import { useParams, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { AuthContext, baseUrl } from '../utility'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useToast } from '../ToastContext'

export default function DetailPage() {
    const router = useRouter()

    const [item, setItem] = useState<ProductsList | null>(null)
    const { showToastMessage } = useToast()
    const { loading, user } = useContext(AuthContext)


    const { iddetail } = useParams<{ iddetail: string }>()
    useEffect(() => {
        (async () => {
            const response = await fetch(`${baseUrl}/products/${iddetail}`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setItem(data)

            } else {
                alert(`${response.status}: ${response.statusText}`)
            }
        })()
    }, [iddetail])

    if (!item) {
        return
    }

    async function addToCart() {
        if (!loading && !user) {
            return router.push('/login')
        }
        const response = await fetch(`${baseUrl}/shopping`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: item?.id })

        })
        if (response.ok) {
            showToastMessage()
        } else {
            alert(`${response.status}: ${response.statusText}`)
        }
    }





    return (
        <div className='detail'>
            <div className='container'>
                <button className='back' onClick={() => router.back()}>BACK</button>
                <div className="box">
                    <Zoom><img src={`${baseUrl}${item.img}`} alt="" /></Zoom>
                    <div className='item'>
                        <h2>{item.title}</h2>
                        <p></p>
                        <div className="prices">
                            {item.oldPrice && <span className='oldPrice'>${item.oldPrice}</span>}
                            <span className='price'>${item.price}</span>
                        </div>
                        <div className="content">
                            <button>-</button>
                            <span className='count'>0</span>
                            <button>+</button>
                        </div>
                        <button className='add_btn' onClick={() => {
                            addToCart()
                        }}>Add to cart</button>
                    </div>
                </div>
                <div className="box2">
                    <h3>Description</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, ratione neque asperiores magni harum aspernatur repellendus beatae ipsa reiciendis, ad, eligendi rem nesciunt consequatur mollitia dolorum eum officia maiores libero recusandae officiis sapiente. Deleniti, cumque! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorem iusto iste corrupti, facilis molestiae. Doloremque, praesentium laboriosam. Optio nam, quibusdam dolore vel fuga quae assumenda praesentium laborum eum, laudantium vero est eius impedit deleniti reprehenderit excepturi aperiam pariatur aliquid nisi architecto corporis debitis mollitia. Magnam quisquam perferendis ratione facere.
                    </p>
                </div>
            </div>
        </div>
    )
}
