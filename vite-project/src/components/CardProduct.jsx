const CardProducto = ({ producto, onVender }) => {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
        {/* Contenedor de imagen compacta */}
        <div className="relative pt-2 px-2 flex justify-center">
          {producto.imagen ? (
            <img 
              src={producto.imagen} 
              alt={producto.name}
              className="h-24 w-24 object-contain rounded-lg bg-white/5 p-1 border border-white/10"
            />
          ) : (
            <div className="h-24 w-24 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
  
        {/* Contenido de la tarjeta */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-white truncate text-center">{producto.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-yellow-300 font-bold">${producto.price}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              producto.cantidad > 3 ? 'bg-green-500/20 text-green-300' : 
              producto.cantidad > 0 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {producto.cantidad} en stock
            </span>
          </div>
        </div>
  
        {/* Botón de acción */}
        <button
          onClick={onVender}
          disabled={producto.cantidad <= 0}
          className={`w-full py-2 px-4 text-sm font-medium mt-auto ${
            producto.cantidad > 0 
              ? 'bg-yellow-500 hover:bg-yellow-400 text-blue-900' 
              : 'bg-gray-500 cursor-not-allowed text-gray-300'
          } transition-colors`}
        >
          {producto.cantidad > 0 ? 'Registrar Venta' : 'Sin Stock'}
        </button>
      </div>
    );
  };
  
  export default CardProducto;