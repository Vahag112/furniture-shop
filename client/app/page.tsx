import Gallery from "./components/gallery/Gallery";
import Products from "./components/products/Products";
import ShopNow from "./components/shopNow/ShopNow";

export default function Home() {
  return (
   <>
    <Products />
    <ShopNow />
    <Gallery />
   </>
  );
}
