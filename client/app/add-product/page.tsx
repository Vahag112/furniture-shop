'use client'
import { FormEvent, useContext, useState } from 'react'
import './addProduct.scss'
import { AuthContext, baseUrl } from '../utility'
import { useRouter } from 'next/navigation'


export default function AddProduct() {
    const { user, loading } = useContext(AuthContext)
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [oldPrice, setOldPrice] = useState('')
    const [discount, setDiscount] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [categoryId, setCategoryId] = useState('')


    if (loading) {
        return
    }

    if (user?.role !== 'admin') {
        router.replace('/')
        return
    }



    async function handleFormSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        setError('')

        if (!imageFile) {
            setError('Please select a product image')
            return
        }


        const formData = new FormData();

        formData.append('title', title);
        formData.append('price', price);



        formData.append('img', imageFile);


        if (oldPrice) {
            formData.append('oldPrice', oldPrice);
        }

        if (discount) {
            formData.append('discount', discount);
        }

        if (categoryId) {
            formData.append('categoryId', categoryId);
        }
        try {
            setSubmitting(true)

            const response = await fetch(`${baseUrl}/products`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)

                setError(
                    typeof data?.message === 'string'
                        ? data.message
                        : Array.isArray(data?.message)
                            ? data.message.join(', ')
                            : 'Failed to add product'
                )
                return
            }

            // setTitle('')
            // setPrice('')
            // setOldPrice('')
            // setDiscount('')
            // setCategoryId('')
            // setImageFile(null)

            router.push('/products')
        } catch {
            setError('Server connection failed')
        } finally {
            setSubmitting(false)
        }
    }



    return (
        <div className="add_prod">
            <div className="container">
                <h2>Add Product</h2>

                <form onSubmit={handleFormSubmit}>
                    <label>
                        Title*
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Price*
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Old price
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={oldPrice}
                            onChange={e => setOldPrice(e.target.value)}
                        />
                    </label>

                    <label>
                        Discount (%)
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                        />
                    </label>

                    <label>
                        Category ID*
                        <input
                            type="number"
                            min="1"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                        />
                    </label>

                    <label>
                        Product image*
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e =>
                                setImageFile(e.target.files?.[0] ?? null)
                            }
                            required
                        />
                    </label>

                    {imageFile && (
                        <p>Selected image: {imageFile.name}</p>
                    )}

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>

    )
}
