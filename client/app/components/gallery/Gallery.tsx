import './Gallery.scss'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'



export default function Gallery() {

  const images = [
    '/images/gallery1.png',
    '/images/gallery2.png',
    '/images/gallery3.png',
    '/images/gallery4.png',
    '/images/gallery5.png',
    '/images/gallery6.png',
  ]

  return (
    <div className="gallery">
        <div className="container">
          <div className="content1">
          <span>Check Our Collection</span>
          <h2>Our Furniture Gallery</h2>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          </div>
          <div className="content2">
            {
              images.map((elem,index) => (
                <Zoom key={index}><img src={elem} alt=""  loading='lazy'/></Zoom>
              ))
            }
          </div>
        </div>
    </div>
  )
}
