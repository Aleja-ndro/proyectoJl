import { useState } from 'react';

export default function BuscarProductos() {
  const [keyword, setKeyword] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscar = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://proyectojl.onrender.com/productos/buscar?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error('No se pudo buscar');
      const data = await res.json();
      setResultados(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Buscar producto..."
      />
      <button onClick={buscar}>Buscar</button>

      {loading && <p>Buscando...</p>}
      {error && <p>Error: {error}</p>}
      {resultados.length > 0 && (
        <div>
          <p>Se encontraron {resultados.length} resultados:</p>
          {resultados.map((p, i) => (
            <div key={i}>
              <h3>{p.descripcion}</h3>
              <p>Código: {p.codigo} | Precio: ${p.precioVenta}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
