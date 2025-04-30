const guardarTicket = async () => {
    // Validación básica
    if (ventasDelDia.length === 0) {
      alert("No hay productos en el ticket para guardar");
      return;
    }
  
    setIsSaving(true); // Activar estado de carga
    setShowConfirmModal(false); // Cerrar modal de confirmación
  
    try {
      // 1. Preparar datos del ticket
      const totalTicket = ventasDelDia.reduce((sum, venta) => sum + venta.total, 0);
      const ticket = {
        fecha: new Date().toISOString(),
        total: totalTicket,
        items: ventasDelDia.map(venta => ({
          productoId: venta.productoId,
          nombre: venta.nombre,
          cantidad: venta.cantidad,
          precioUnitario: venta.precioUnitario,
          total: venta.total
        })),
        estado: 'completado'
      };
  
      // 2. Guardar ticket en Supabase
      const { data: ticketGuardado, error: ticketError } = await supabase
        .from('tickets')
        .insert([ticket])
        .select();
  
      if (ticketError) throw ticketError;
  
      // 3. Actualizar stock de productos (en paralelo)
      const actualizacionesStock = ventasDelDia.map(async (venta) => {
        // Obtener cantidad actual
        const { data: producto, error: fetchError } = await supabase
          .from('accecelulares')
          .select('cantidad')
          .eq('id', venta.productoId)
          .single();
  
        if (fetchError) throw fetchError;
        if (!producto) throw new Error(`Producto ${venta.productoId} no encontrado`);
  
        // Actualizar stock
        const { error: updateError } = await supabase
          .from('accecelulares')
          .update({ cantidad: producto.cantidad - venta.cantidad })
          .eq('id', venta.productoId);
  
        if (updateError) throw updateError;
      });
  
      await Promise.all(actualizacionesStock);
  
      // 4. Actualizar la interfaz
      setVentasDelDia([]); // Limpiar ventas del día
      
      // Recargar productos para reflejar nuevos stocks
      const { data: productosActualizados, error: productosError } = await supabase
        .from('accecelulares')
        .select('*');
  
      if (productosError) throw productosError;
  
      setProductos(productosActualizados);
      setProductosOriginales(productosActualizados);
      
      // 5. Actualizar total facturado
      await calcularTotalFacturado();
  
      // 6. Feedback al usuario
      alert(`✅ Ticket #${ticketGuardado[0]?.id || ''} guardado\nTotal: $${totalTicket.toFixed(2)}`);
  
    } catch (error) {
      console.error("Error completo al guardar ticket:", error);
      alert(`❌ Error al guardar ticket: ${error.message}`);
      
      // Opcional: Revertir cambios locales si falla
      setShowConfirmModal(true); // Volver a mostrar el modal de confirmación
    } finally {
      setIsSaving(false); // Siempre desactivar el estado de carga
    }
  };