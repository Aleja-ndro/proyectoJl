import ProductCard from "../components/ProductCard";
import PromoCarousel from "../components/PromoCarousel";
import Footer from "../components/Footer";
import{products}from '../data/mockData';

export default function Home(){
    return(
        <div className="container mx-auto py-8">
            <PromoCarousel/>
            <h1 className="text-3xl font-bold mb-8">Productos destacados</h1>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                {products.slice(0,3).map(product =>(
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
            <Footer/>
        </div>
    );
}