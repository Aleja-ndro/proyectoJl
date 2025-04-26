import { useEffect, useState } from "react";
import InputBusqueda from "../components/InputBusqueda";
import FormularioProducto from "../components/FormularioProducto";  // Asegúrate de importar el componente correctamente
import { supabase } from "../../supabaseClient";

import CardProducto from "../components/CardProduct";
export default function Kiosko() {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [ventasDelDia, setVentasDelDia] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarProductos = async () => {
      const { data, error } = await supabase.from("accecelulares").select("*");
      if (error) {
        console.error("Error cargando productos", error.message);
      } else {
        setProductosOriginales(data);
        setProductos(data);
      }
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
        { nombre: producto.name, precio: producto.price, fecha: new Date() },
      ]);
    }
  };

  const handleProductAgregado = async () => {
    console.log("Producto agregado correctamente");
    const { data, error } = await supabase.from("accecelulares").select("*");
    if (!error) {
      setProductosOriginales(data);
      setProductos(data);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-teal-400 to-blue-600 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-yellow-100">Panel Kiosko</h1>

      {/* Formulario para agregar un producto */}
      <InputBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <CardProducto
            key={producto.id}
            producto={producto}
            onVender={() => manejarVentas(producto.id)}
          />
        ))}
      </div>

      <FormularioProducto onProductAgregado={handleProductAgregado} />

      <h2 className="text-xl font-bold mt-8 text-yellow-200">Ventas del día:</h2>
      <ul className="mt-2 text-gray-100">
        {ventasDelDia.map((venta, i) => (
          <li key={i} className="mb-2">
            {venta.nombre} - ${venta.precio} - {venta.fecha.toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
