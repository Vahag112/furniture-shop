import Link from 'next/link'
import './Footer.scss'

export default function Footer() {

    const footerList = [
        {
            title: 'Category', links: [
                { name: 'Living Room', href: '/' },
                { name: 'Bed Room', href: '/' },
                { name: 'Kitchen', href: '/' },
                { name: 'Bath Room', href: '/' }
            ],

        },
        {
            title: 'Popular Product', links: [
                { name: 'Single Sofa Black', href: '/' },
                { name: 'Wooden Bookcase', href: '/' },
                { name: 'Wooden Chair', href: '/' },
                { name: 'Luxury White Bed', href: '/' }
            ],

        },
        {
            title: 'Sitemap', links: [
                { name: 'Product', href: '/' },
                { name: 'Services', href: '/' },
                { name: 'Article', href: '/' },
                { name: 'About Us', href: '/' }
            ],

        },
        {
            title: 'Follow Us', links: [
                { name: 'Facebook', href: '/' },
                { name: 'Instagram', href: '/' },
                { name: 'TikTok', href: '/' },
                { name: 'Youtube', href: '/' }
            ],

        }
    ]

    return (
        <footer>
            <div className="container">
                <div className="content">
                <div className="item">
                    <img src="/svgs/footerLogo.svg" alt="" loading='lazy' />
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className="box">
                {
                    footerList.map((elem, index) => (
                        <ul key={index}>
                            <li className='title'>{elem.title}</li>
                            {
                                elem.links.map(elem => (
                                    <li key={elem.name}><Link href={elem.href}>{elem.name}</Link></li>
                                ))
                                
                            }
                        </ul>
                    ))
                }
                </div>
                </div>

                <div className="line"></div>
                <p className='copyright'>© 2023 by Logo Furniture. All rights reserved.</p>

            </div>
        </footer>
    )
}
