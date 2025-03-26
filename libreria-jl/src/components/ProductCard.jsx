export default function ProductCard({product}){
    return(
        <div className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"/>
            <div className="p-4">
                < h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-gray-700">${product.price}</p>
                <button className="mt-2 bg-blue-500 text-whir
                 px-4 py-2 rounded hover:bg-blue-600 transition-colors">Agregar al carrito
                 </button>
                    
                </div>    
        </div>
    );
}