import { useEffect, useState } from "react";
import InputBusqueda from "../components/InputBusqueda";
import FormularioProducto from "../components/FormularioProducto";
import { supabase } from "../../supabaseClient";
import CardProducto from "../components/CardProduct";

export default function Kiosko() {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [ventasDelDia, setVentasDelDia] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("accecelulares").select("*");
      if (error) {
        console.error("Error cargando productos", error.message);
      } else {
        setProductosOriginales(data);
        setProductos(data);
      }
      setIsLoading(false);
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtrados = productosOriginales.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      );
      setProductos(filtrados);
    }, 300);
    return () => clearTimeout(timeout);
  }, [busqueda, productosOriginales]);

  const manejarVentas = (productoId) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoId && p.cantidad > 0 ? { ...p, cantidad: p.cantidad - 1 } : p
      )
    );
    const producto = productos.find((p) => p.id === productoId);
    if (producto && producto.cantidad > 0) {
      setVentasDelDia((prev) => [
        ...prev,
        { 
          nombre: producto.name, 
          precio: producto.price, 
          fecha: new Date(),
          id: Date.now() + Math.random().toString(36).substring(2)
        },
      ]);
    }
  };

  const handleProductAgregado = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("accecelulares").select("*");
    if (!error) {
      setProductosOriginales(data);
      setProductos(data);
    }
    setIsLoading(false);
  };

  const eliminarVenta = (ventaId) => {
    setVentasDelDia(prev => prev.filter(v => v.id !== ventaId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 p-4 sm:p-6 text-white">
      {/* Header con efecto glass */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-400 mb-2">
          Panel Kiosko
        </h1>
        <p className="text-center text-blue-200">Gestión de productos y ventas</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-8">
        <InputBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {productos.map((producto) => (
          <CardProducto
            key={producto.id}
            producto={producto}
            onVender={() => manejarVentas(producto.id)}
          />
        ))}
      </div>

      {/* Formulario para agregar producto */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-yellow-300">Agregar Nuevo Producto</h2>
        <FormularioProducto onProductAgregado={handleProductAgregado} />
      </div>

      {/* Sección de ventas */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-300">Ventas del Día</h2>
          <span className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
            Total: ${ventasDelDia.reduce((sum, venta) => sum + venta.precio, 0).toFixed(2)}
          </span>
        </div>
        
        {ventasDelDia.length === 0 ? (
          <p className="text-blue-200 text-center py-4">No hay ventas registradas hoy</p>
        ) : (
          <ul className="divide-y divide-white/20">
            {ventasDelDia.map((venta) => (
              <li key={venta.id} className="py-3 flex justify-between items-center group">
                <div>
                  <span className="font-medium">{venta.nombre}</span>
                  <span className="block text-sm text-blue-200">
                    {venta.fecha.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-yellow-300 mr-4">${venta.precio}</span>
                  <button 
                    onClick={() => eliminarVenta(venta.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-400 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Efecto de partículas decorativas (consistente con login) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}