'use client'


import './ShopNow.scss'



export default function ShopNow() {
  return (
    <div className='shopNow'>
        <div className="container">
            <div className="item">
                <div className="box">
                    <h3>Wooden Chair</h3>
                    <button>Shop now</button>
                </div>
                <img src='/images/sec2-1.png' alt="" />
            </div>
            <div className="item">
                 <div className="box">
                    <h3>Bookcase</h3>
                    <button>Shop now</button>
                </div>
                <img src='/images/sec2-2.png' alt="" />

            </div>
            <div className="item">
                 <div className="box">
                    <h3>Single Sofa</h3>
                    <button>Shop now</button>
                </div>
                <img src='/images/sec2-3.png' alt="" />
            </div>
        </div>
    </div>
  )
}
