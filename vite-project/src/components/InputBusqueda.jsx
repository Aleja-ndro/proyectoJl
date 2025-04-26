const InputBusqueda = ({ busqueda, setBusqueda }) => {
    return (
      <div className="relative max-w-md mx-auto w-full mb-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-5 py-3 pr-12 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-md"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    );
  };
  
  export default InputBusqueda;