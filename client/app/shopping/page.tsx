'use client'
import { useCallback, useContext, useEffect, useState } from 'react'
import './Shopping.scss'
import { AuthContext, baseUrl } from '../utility'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  title: string
  price: string
  oldPrice: string | null
  img: string
  discount: number | null
}

export type ShoppingItem = {
  id: number
  userId: number
  productId: number
  quantity: number
  product: Product
}

export default function page() {
  const [shoppings, setShoppings] = useState<ShoppingItem[]>([])
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if(!loading && !user){
      router.replace('/login')
      return
    }
    try {
      (async () => {
        const response = await fetch(`${baseUrl}/shopping`, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setShoppings(data)
        }
        else {
          alert(`${response.status}: ${response.statusText}`)
        }
      })()

    } catch (error) {
      console.error(error);

    }
  }, [user, router])

  async function deleteShopping(id: string) {
    const response = await fetch(`${baseUrl}/shopping/${id}`,{
      method: "DELETE",
      credentials: 'include',
    })
    if(response.ok){
      setShoppings(item => item.filter(elm => elm.productId !== Number(id)))
    }else{
      alert(`${response.status}: ${response.statusText}`)
    }
  }


  async function updateQuantity(id: number, quantity: number) {
    try {
      const response = await fetch(`${baseUrl}/shopping/${id}`,{
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity})

      })
    if(!response.ok){
       alert(`${response.status}: ${response.statusText}`)
      return false
    }
    return true
    } catch (error) {
        console.error(error);
        return false
    }
  }


  async function increaseQuantity(item: ShoppingItem) {
  const newQuantity = item.quantity + 1

  const success = await updateQuantity(item.id, newQuantity)

  if (success) {
    setShoppings(items =>
      items.map(elm =>
        elm.id === item.id
          ? { ...elm, quantity: newQuantity }
          : elm
      )
    )
  }
}


async function decreaseQuantity(item: ShoppingItem) {
  if (item.quantity <= 1) return

  const newQuantity = item.quantity - 1

  const success = await updateQuantity(item.id, newQuantity)

  if (success) {
    setShoppings(items =>
      items.map(elm =>
        elm.id === item.id
          ? { ...elm, quantity: newQuantity }
          : elm
      )
    )
  }
}

const total = shoppings.reduce((sum, item) => {
  return sum + Number(item.product.price) * item.quantity
}, 0)

  return (
    <>
    {loading ? <p>Loading...</p>  :(<div className='shopping'>
      <div className="container">
        <h3>Total Price - {total}</h3>
        {
          shoppings.map(elem => (
            <div className="item" key={elem.id}>
              <img src={elem.product.img} alt="" />
              <div className="box">
                <h2>{elem.product.title}</h2>
                <div className="prices">
                 {elem.product.oldPrice && <span className='oldPrice'>${elem.product.oldPrice}</span>}
                  <span className='price'>${elem.product.price}</span>
                </div>
                <div className="count_div">
                  <button onClick={() => {
                    decreaseQuantity(elem)
                  }} disabled={elem.quantity <= 1}>-</button>
                  <span className='count'>{elem.quantity}</span>
                  <button onClick={() => {
                    increaseQuantity(elem)
                  }}>+</button>
                </div>
                <button className="delBtn" onClick={() => {
                  deleteShopping((elem.productId).toString())
                }}>Remove</button>
              </div>

            </div>
          ))
        }
      </div>
    </div>)}
    </>
  )
}
