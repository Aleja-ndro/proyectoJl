export default function InputBusqueda({busqueda,setBusqueda,onBuscar }){
    return (
        <div className="flex flex-col mb-4">
            <input
            type="text"
            value={busqueda}
            onChange={(e)=>setBusqueda(e.target.value)}
            placeholder="Escribi el articulo a buscar..."
            className="text-neutral-800 border p-2 roundes w-full"/> 
         </div>
    )
}