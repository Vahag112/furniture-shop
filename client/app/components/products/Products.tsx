'use client'
import { useEffect, useState } from 'react'
import './Products.scss'
import { baseUrl } from '@/app/utility'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/ToastContext'

export type ProductsList = {
  id: number
  title: string
  price: string
  oldPrice?: string
  discount?: number
  img: string

}

export default function Products() {
  const [list, setList] = useState<ProductsList[]>([])
  const router = useRouter()
    const {showToastMessage} = useToast()



  useEffect(() => {

    (async () => {

      const response = await fetch(`${baseUrl}/products`)

      if (response.ok) {
        const data = await response.json()
        console.log(data);
        
        setList(data)
      } else {
        alert(response.status + ': ' + response.statusText)
      }

    })()
  }, [])


  async function addToCart(productId: number) {
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



  return (
    <div className='products'>
      <div className="container">
        <div className="content1">
          <span>Check Our Product</span>
          <h2>Crafted with excellent material</h2>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
        <div className="content2">
          {
            list.map(elem => (
              <div className="item" key={elem.id} onClick={() => {
                router.push(`/${elem.id}`)
              }}>
                <div className="box">
                  <img src={`${baseUrl}${elem.img}`} alt="" className='prod_imgs' />
                  <button onClick={(e) => {
                    e.stopPropagation()
                    addToCart(elem.id)
                  }}><img src="./svgs/bag1sec.svg" alt="" />Add to cart</button>
                </div>
                <h3>{elem.title}</h3>
                <div className="prices">
                  {elem.oldPrice && <span className='oldPrice'>${elem.oldPrice}</span>}
                  <span className='price'>${elem.price}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
