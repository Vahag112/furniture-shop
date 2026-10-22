'use client'

import { useParams, useRouter } from 'next/navigation'
import './EditProduct.scss'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { AuthContext, baseUrl } from '@/app/utility'


export default function EditProduct() {
    const { id } = useParams<{ id: string }>()
    const { user, loading } = useContext(AuthContext)
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [oldPrice, setOldPrice] = useState('')
    const [discount, setDiscount] = useState(0)
    const [errors, setErrors] = useState({})


    useEffect(() => {
        if (loading) {
            return
        }

        if (!user || user.role !== 'admin') {
            router.replace('/')
            return
        }

        (async () => {
            const response = await fetch(`${baseUrl}/products/${id}`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setTitle(data.title);
                setPrice(data.price);
                setOldPrice(data.oldPrice ?? '');
                setDiscount(data.discount ?? 0);
            }
            else {
                alert(`${response.status}: ${response.statusText}`)
            }
        })()
    }, [id, loading, user, router])



async function handleFormSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    try {
        const response = await fetch(`${baseUrl}/products/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                price: Number(price),
                oldPrice: oldPrice === '' ? null : Number(oldPrice),
                discount,
            }),
        });

        const data = await response.json().catch(() => null);
        

        if (!response.ok) {
             console.log(data); // ValidationPipe-ի մանրամասն հաղորդագրությունները այստեղ են
    alert(`${response.status}: ${data?.message ?? response.statusText}`)
        }

        router.push('/products');
    } catch (error) {
        console.error('Update product error:', error);
        alert('Server connection failed');
    }
}



    return (
        <div className='edit'>
            <div className="container">
                <h2>Edit</h2>
                <form onSubmit={handleFormSubmit}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
                    <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                    <button>Save</button>
                </form>
            </div>
        </div>
    )
}
