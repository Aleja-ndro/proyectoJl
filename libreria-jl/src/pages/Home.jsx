import ProductCard from "../components/ProductCard";
import{products}from '../data/mockData';

export default function Home(){
    return(
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Productos destacados</h1>
            <div className="gird grid-cols-1 md:grid-col-3 gap-6">
                {products.slice(0,3).map(product =>(
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
    );
}