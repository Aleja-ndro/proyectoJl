import { useParams } from "react-router-dom";
import ProductCard  from "../components/ProductCard";
import { products } from "../data/mockData";

export default function Category(){
    const {id}=useParams();
    const filteredProducts=products.filter(p=>p.category=== id);

     return(
        <div className="container mx-auto py-8">
            <h1 className="text-3x1 font-bold mb-8 capitalize">{id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map(product =>(
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
     )
}