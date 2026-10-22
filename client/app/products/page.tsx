'use client'
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from 'react'
import './ProductsPage.scss'
import { AuthContext, baseUrl } from '@/app/utility'
import { useRouter } from 'next/navigation'
import { useToast } from '../ToastContext'
import Link from 'next/link'

type ProductsList = {
    id: number
    title: string
    price: string
    oldPrice?: string
    discount?: number
    img: string

}

type Category = {
    id: number
    name: string
    slug: string
}

export default function ProductsPage() {
    const [list, setList] = useState<ProductsList[]>([])
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { showToastMessage } = useToast()
    const { user, loading } = useContext(AuthContext)


    useEffect(() => {
        (async () => {
            const response = await fetch(`${baseUrl}/categories`)

            if (response.ok) {
                const data: Category[] = await response.json()
                setCategories(data)

            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const url = selectedCategory ? `${baseUrl}/products?category=${encodeURIComponent(selectedCategory)}` : `${baseUrl}/products`
            const response = await fetch(url)

            if (response.ok) {
                const data = await response.json()
                setList(data)
            } else {
                alert(response.status + ': ' + response.statusText)
            }

        })()
    }, [selectedCategory])


    async function addToCart(productId: number) {

        if (loading) {
            return
        }
        if (!user) {
            router.push('/login')
            return
        }

        const response = await fetch(`${baseUrl}/shopping`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        })

        if (response.ok) {
            showToastMessage()
        } else {
            alert(`${response.status}: ${response.statusText}`)
        }
    }



    async function deleteProduct(id: number) {

        if (loading) {
            return
        }
        if (user?.role !== 'admin') {
            return;
        }

        const response = await fetch(`${baseUrl}/products/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (response.ok) {
            setList(elm => elm.filter(item => item.id !== id))
        }

        else {
            alert(`${response.status}: ${response.statusText}`)
        }

    }




    return (
        <div className='products'>
            <div className='container'>
                <div className='content1'>
                    <span>Check Our Product</span>
                    <h2>Products</h2>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">All</option>
                        {
                            categories.map(elem => (
                                <option value={elem.slug} key={elem.name}>
                                    {elem.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className='content2'>
                    {
                        list.map(elem => (
                            <div className='item' key={elem.id} onClick={() => {
                                router.push(`/${elem.id}`)
                            }}>
                                {user?.role === 'admin' && (
                                    <div className="detail">
                                        <button className='delete' onClick={(e) => {
                                            e.stopPropagation()
                                            deleteProduct(elem.id)
                                        }}>X</button>
                                        <button className="edit" onClick={(e) => {
                                            e.stopPropagation()
                                            router.push(`/products/edit/${elem.id}`)
                                        }}><FaRegEdit /></button>
                                    </div>
                                )}
                                <div className='box'>
                                    <img src={
                                        `${baseUrl}${elem.img}`
                                    } alt="" className='prod_imgs' />
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        addToCart(elem.id)
                                    }}><img src="./svgs/bag1sec.svg" alt="" />Add to cart</button>
                                </div>
                                <h3>{elem.title}</h3>
                                <div className='prices'>
                                    {elem.oldPrice && <span className='oldPrice'>${elem.oldPrice}</span>}
                                    <span className='price'>${elem.price}</span>
                                </div>
                            </div>
                        ))
                    }
                    {user?.role === 'admin' && (
                        <div className="add_item">
                            <Link href='/add-product'>+</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
