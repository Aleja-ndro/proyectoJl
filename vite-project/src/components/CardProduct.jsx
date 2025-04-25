export default function CardProducto({ producto, onVender }) {
    console.log("Renderizando CardProducto con:", producto); // Log general del producto

    return (
        <div className="border border-gray-300 bg-gradient-to-tl from-blue-500 to-purple-600 p-4 rounded-xl shadow-lg w-64 m-2 hover:scale-105 transition-all duration-300 ease-in-out">
            <img
                src={producto.imagen}
                alt={producto.name}
                className="w-full h-36 object-cover rounded-t-xl mb-4"
                onError={(e) => {
                    console.error("Error cargando imagen:", e); // Log si falla la imagen
                    console.warn("Imagen fallida para producto:", producto.name, "URL:", producto.imagen); // Más detalle
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"; // Placeholder visible
                }}
                onLoad={() => {
                    console.log("Imagen cargada correctamente:", producto.imagen);
                }}
            />
            <h2 className="text-lg font-semibold text-white">{producto.name}</h2>
            <p className="text-sm text-gray-100 mt-2">{producto.descripcion}</p>
            <div className="mt-3">
                <p className="text-base font-semibold text-yellow-200">Precio: ${producto.price}</p>
                <p className="text-xs text-gray-300">Stock: {producto.cantidad}</p>
            </div>
            <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg mt-4 transition-all transform hover:scale-105"
                onClick={() => onVender(producto.id)}
            >
                Vender
            </button>
        </div>
    );
}
