export default function InputBusqueda({busqueda,setBusqueda,buscarProductos }){
    return (
        <div className="flex flex-col mb-4">
            <input
            type="text"
            value={busqueda}
            onChange={(e)=>setBusqueda(e.target.value)}
            placeholder="Escribi el articulo a buscar..."
            className="border p-2 roundes w-full"/> 
            <button
            onClick={buscarProductos}
            className="bg-yellow-400 text-white px-4 mt-2 rounded">
                Buscar
            </button>
        </div>
    )
}