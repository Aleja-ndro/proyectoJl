export default function CardProducto({producto,onVender}){
    return(
        <div className="border p-4 rounded-xl shadow-md w-64 m-2">
            <img src={producto.imagen ||"https://via.placeholder.com" } alt={producto.name} className="w-full h-40 object-cover m-2"/>
            <h2 className="text-lg font-bold">{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Stock:{producto.stock}</p>
            <button
            className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded mt-2"
            onClick={()=>onVender(producto.id)}
            >
                Vender
            </button>
        </div>
    )
    
}