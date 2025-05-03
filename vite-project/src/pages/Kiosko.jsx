import { useEffect, useState } from "react";
import InputBusqueda from "../components/InputBusqueda";
import FormularioProducto from "../components/FormularioProducto";
import { supabase } from "../../supabaseClient";
import CardProducto from "../components/CardProduct";
import { useNavigate } from "react-router-dom";
import { formatearFecha } from "../utils/formatearFecha";

export default function Kiosko() {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [ventasDelDia, setVentasDelDia] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [totalFacturado, setTotalFacturado] = useState(0);
  const [fechaActual,setFechaActual]=useState(new Date().toLocaleDateString());

  // Cargar productos y total facturado
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setIsLoading(true);
      
      try {
        // 1. Cargar productos
        const { data: productosData, error: productosError } = await supabase
          .from("accecelulares")
          .select("*");
        
        if (productosError) throw productosError;
        
        setProductosOriginales(productosData);
        setProductos(productosData);
        
        // 2. Cargar total facturado
        const hoy=new Date();
        const inicioDia=new Date(hoy.setHours(0,0,0,0)).toISOString();
        const finDia=new Date(hoy.setHours(23,59,59,999)).toISOString();
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('total')
          .gte('fecha',inicioDia)
          .lt('fecha',finDia);
        
        if (!ticketsError) {
          const total = ticketsData.reduce((sum, ticket) => sum + ticket.total, 0);
          setTotalFacturado(total);
        }
        
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosIniciales();
  
  //Configurar reinnicio automatico
  const configurarReinicioDiario=()=>{
    const ahora=new Date();
    const horasRestantes=24-ahora.getHours();
    const minutosRestantes=24-ahora.getMinutes();
    const segundosRestantes=24-ahora.getSeconds();
    
    const msHastaMedianoche=
    (horasRestantes*60*60*1000)+
    (minutosRestantes*60*1000)+
    (segundosRestantes*1000);
    const timeoutId=setTimeout(()=>{
      //guardar registro diario antes de iniciar
      guardarRegistroDiario();
      //Reiniciar el estado
      setTotalFacturado(0);
      //Programar el proximo reinicio
      configurarReinicioDiario();
    },msHastaMedianoche);
    return()=>clearImmediate(timeoutId);
  };
  const limpieza=configurarReinicioDiario();
  return()=>{
    limpieza();
  };
},[]);

  // Filtrar productos
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtrados = productosOriginales.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      );
      setProductos(filtrados);
    }, 300);
    return () => clearTimeout(timeout);
  }, [busqueda, productosOriginales]);

  // Manejar ventas (agrupa productos iguales)
  const manejarVentas = (productoId) => {
    setProductos(prev => prev.map(p => 
      p.id === productoId && p.cantidad > 0 ? { ...p, cantidad: p.cantidad - 1 } : p
    ));
    
    const producto = productos.find(p => p.id === productoId);
    if (producto && producto.cantidad > 0) {
      setVentasDelDia(prev => {
        const ventaExistenteIndex = prev.findIndex(v => v.productoId === productoId);
        
        if (ventaExistenteIndex >= 0) {
          const nuevasVentas = [...prev];
          const ventaExistente = nuevasVentas[ventaExistenteIndex];
          
          nuevasVentas[ventaExistenteIndex] = {
            ...ventaExistente,
            cantidad: ventaExistente.cantidad + 1,
            total: (ventaExistente.cantidad + 1) * ventaExistente.precioUnitario
          };
          
          return nuevasVentas;
        } else {
          return [
            ...prev,
            { 
              nombre: producto.name,
              productoId: producto.id,
              precioUnitario: producto.price,
              cantidad: 1,
              total: producto.price,
              fecha: new Date(),
              id: Date.now() + Math.random().toString(36).substring(2)
            }
          ];
        }
      });
    }
  };

  // Eliminar venta y restaurar stock
  const eliminarVenta = (venta) => {
    setVentasDelDia(prev => prev.filter(v => v.id !== venta.id));
    setProductos(prev => prev.map(p => 
      p.id === venta.productoId ? { ...p, cantidad: p.cantidad + venta.cantidad } : p
    ));
  };

  // Guardar ticket en Supabase
  const guardarTicket = async () => {
    if (ventasDelDia.length === 0) return;
    
    setIsSaving(true);
    try {
      const ticket = {
        fecha: new Date().toISOString(),
        total: ventasDelDia.reduce((sum, venta) => sum + venta.total, 0),
        items: ventasDelDia,
        estado: 'completado'
      };

      // 1. Guardar ticket
      const { error: ticketError } = await supabase
        .from('tickets')
        .insert([ticket]);

      if (ticketError) throw ticketError;

      // 2. Actualizar stock de productos
      const updates = ventasDelDia.map(async (venta) => {
        const { data: producto } = await supabase
          .from('accecelulares')
          .select('cantidad')
          .eq('id', venta.productoId)
          .single();

        const nuevaCantidad = producto.cantidad - venta.cantidad;
        
        const { error: updateError } = await supabase
          .from('accecelulares')
          .update({ cantidad: nuevaCantidad })
          .eq('id', venta.productoId);

        if (updateError) throw updateError;
      });

      await Promise.all(updates);

      // 3. Actualizar total facturado
      setTotalFacturado(prev => prev + ticket.total);

      // 4. Actualizar interfaz
      setVentasDelDia([]);
      const { data: productosActualizados } = await supabase
        .from('accecelulares')
        .select('*');
      
      setProductos(productosActualizados);
      setProductosOriginales(productosActualizados);

      alert(`Ticket guardado! Total: $${ticket.total.toFixed(2)}`);

    } catch (error) {
      console.error("Error al guardar:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
      setShowConfirmModal(false);
    }
  };

  // Recargar productos después de agregar uno nuevo
  const handleProductAgregado = async (nuevoProducto) => {
    setIsLoading(true);
    try {
      // 1. Insertar el nuevo producto en Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from("accecelulares")
        .insert([nuevoProducto])
        .select();
  
      if (insertError) throw insertError;
  
      // 2. Actualizar el estado local con los nuevos datos
      const { data, error: fetchError } = await supabase
        .from("accecelulares")
        .select("*");
  
      if (fetchError) throw fetchError;
  
      setProductosOriginales(data);
      setProductos(data);
      
      // 3. Cerrar el modal
      setShowAddModal(false);
      
      // Opcional: Mostrar mensaje de éxito
      alert("Producto agregado correctamente");
      
      return insertedData[0];
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert(`Error al agregar producto: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Modificar producto
// Modificar producto - Versión corregida
const handleModificarProducto = async (datosActualizados) => {
  if (!productoSeleccionado) return;
  
  try {
    // Asegurarse de incluir el ID y todos los campos necesarios
    const datosCompletos = {
      ...datosActualizados,
      id: productoSeleccionado.id,
      // Incluir todos los campos que espera tu tabla
      name: datosActualizados.name,
      costo: parseFloat(datosActualizados.costo),
      price: parseFloat(datosActualizados.price),
      cantidad: parseInt(datosActualizados.cantidad),
      marca: datosActualizados.marca,
      imagen: datosActualizados.imagen
    };

    const { error } = await supabase
      .from('accecelulares')
      .update(datosCompletos)
      .eq('id', productoSeleccionado.id);

    if (error) throw error;

    // Actualizar el estado local directamente sin recargar todo
    setProductos(prev => prev.map(p => 
      p.id === productoSeleccionado.id ? { ...p, ...datosCompletos } : p
    ));
    setProductosOriginales(prev => prev.map(p => 
      p.id === productoSeleccionado.id ? { ...p, ...datosCompletos } : p
    ));
    
    setProductoSeleccionado(null);
    setShowEditModal(false);
    alert("Producto modificado correctamente");
  } catch (error) {
    console.error("Error modificando producto:", error);
    alert(`Error al modificar producto: ${error.message}`);
  }
};
  // Función para manejar logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  // Eliminar producto
  const handleEliminarProducto = async () => {
    if (!productoSeleccionado) return;
    
    if (!confirm(`¿Eliminar permanentemente ${productoSeleccionado.name}?`)) return;

    try {
      const { error } = await supabase
        .from('accecelulares')
        .delete()
        .eq('id', productoSeleccionado.id);

      if (error) throw error;

      // Actualizar estado local
      setProductos(prev => prev.filter(p => p.id !== productoSeleccionado.id));
      setProductosOriginales(prev => prev.filter(p => p.id !== productoSeleccionado.id));
      setProductoSeleccionado(null);
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error al eliminar producto");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 p-4 sm:p-6 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-400 mb-2">
          Kiosko Candy
        </h1>
        <p className="text-center text-blue-200">{formatearFecha(new Date())}</p>
        <div className="text-center mt-2">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Total Facturado: ${totalFacturado.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Barra superior con búsqueda y botonera */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <InputBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar
          </button>
          <button
            onClick={() => productoSeleccionado ? setShowEditModal(true) : alert("Selecciona un producto primero")}
            disabled={!productoSeleccionado}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              !productoSeleccionado 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modificar
          </button>
          <button
            onClick={handleEliminarProducto}
            disabled={!productoSeleccionado}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              !productoSeleccionado 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-black'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Eliminar
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Salir
          </button>
        </div>
      </div>

      {/* Diseño de 2 columnas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna principal - Productos */}
        <div className="lg:w-2/3 order-2 lg:order-1">
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <>
              {/* Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {productos.map((producto) => (
                  <div 
                    key={producto.id} 
                    onClick={() => setProductoSeleccionado(producto)}
                    className={`cursor-pointer transition-all ${
                      productoSeleccionado?.id === producto.id 
                        ? 'ring-2 ring-yellow-400 scale-[1.02]' 
                        : 'hover:scale-[1.03]'
                    }`}
                  >
                    <CardProducto
                      producto={producto}
                      onVender={() => manejarVentas(producto.id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Columna del Ticket */}
        <div className="lg:w-1/3 order-1 lg:order-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg lg:sticky lg:top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-yellow-300">Ticket del Día</h2>
              <span className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                Total: ${ventasDelDia.reduce((sum, venta) => sum + (venta?.total || 0), 0).toFixed(2)}
              </span>
            </div>
            
            {ventasDelDia.length === 0 ? (
              <p className="text-blue-200 text-center py-4">No hay productos en el ticket</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {ventasDelDia.map((venta) => (
                  <div key={venta.id} className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium block">
                          {venta.cantidad > 1 ? `${venta.cantidad}x ` : ''}{venta.nombre}
                        </span>
                        <span className="text-xs text-blue-200">
                          {new Date(venta.fecha).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-yellow-300">
                          ${venta.total.toFixed(2)}
                        </span>
                        {venta.cantidad > 1 && (
                          <span className="text-xs text-blue-300">
                            ${venta.precioUnitario.toFixed(2)} c/u
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={() => eliminarVenta(venta)}
                        className="text-red-300 hover:text-red-400 transition-colors flex items-center text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {ventasDelDia.length > 0 && (
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={isSaving}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isSaving 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : 'Guardar Ticket'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Edicion producto */}
      {showEditModal && productoSeleccionado && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"> {/* Añade max-h y overflow */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2"> {/* Sticky header */}
        <h3 className="text-lg font-bold text-gray-800">Editar Producto</h3>
        <button 
          onClick={() => setShowEditModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <FormularioProducto 
        producto={productoSeleccionado}
        isEditing={true}
        onProductAgregado={handleModificarProducto}
        onCancel={() => setShowEditModal(false)}
      />
    </div>
  </div>
)}
      
      {/* Modal de confirmación de venta */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar Venta</h3>
            
            <div className="mb-4">
              <p className="font-medium mb-2">Detalles del ticket:</p>
              <div className="max-h-[200px] overflow-y-auto mb-2 border rounded p-2">
                {ventasDelDia.map(venta => (
                  <div key={venta.id} className="flex justify-between py-2 border-b last:border-b-0">
                    <span>
                      {venta.cantidad > 1 ? `${venta.cantidad}x ` : ''}
                      {venta.nombre}
                    </span>
                    <span className="font-medium">${venta.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-2 border-t">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg">
                  ${ventasDelDia.reduce((sum, venta) => sum + venta.total, 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">¿Confirmas que deseas registrar esta venta?</p>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={guardarTicket}
                disabled={isSaving}
                className={`px-4 py-2 rounded transition-colors ${
                  isSaving
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSaving ? 'Guardando...' : 'Confirmar Venta'}
              </button>
            </div>
          </div>
        </div>
      )}

{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"> {/* Cambios aquí */}
      <div className="flex justify-between items-center mb-3"> {/* Reducido mb-4 a mb-3 */}
        <h3 className="text-lg font-bold">Agregar Nuevo Producto</h3>
        <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <FormularioProducto 
        onProductAgregado={async (nuevoProducto) => {
          await handleProductAgregado(nuevoProducto);
          setShowAddModal(false);
        }}
        onCancel={() => setShowAddModal(false)}
      />
    </div>
  </div>
)}
      
      {/* Efectos visuales */}
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