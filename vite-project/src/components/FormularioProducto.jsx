import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

export default function FormularioProducto({ 
  producto = null, 
  isEditing = false, 
  onProductAgregado, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: '',
    costo: '',
    price: '',
    cantidad: '',
    marca: '',
    imagen: ''
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Cargar datos del producto al iniciar o cambiar
  useEffect(() => {
    if (producto && isEditing) {
      setFormData({
        name: producto.name || '',
        costo: producto.costo || '',
        price: producto.price || '',
        cantidad: producto.cantidad || '',
        marca: producto.marca || '',
        imagen: producto.imagen || ''
      });
    } else {
      // Resetear formulario si no está en modo edición
      setFormData({
        name: '',
        costo: '',
        price: '',
        cantidad: '',
        marca: '',
        imagen: ''
      });
    }
  }, [producto, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, imagen: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imagen;
  
      if (file) {
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('image')
          .upload(fileName, file);
  
        if (uploadError) throw uploadError;
  
        const { data: { publicUrl } } = supabase.storage
          .from('image')
          .getPublicUrl(fileName);
  
        imageUrl = publicUrl;
      }
  
      const productData = {
        name: formData.name,
        costo: parseFloat(formData.costo) || 0,
        price: parseFloat(formData.price),
        cantidad: parseInt(formData.cantidad),
        marca: formData.marca,
        imagen: imageUrl
      };
  
      // Si está en modo edición, incluir el ID
      if (isEditing && producto) {
        productData.id = producto.id;
      }
  
      await onProductAgregado(productData);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo Nombre */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border-2 border-blue-800 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          required
        />
      </div>

      {/* Campo Costo */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Costo</label>
        <input
          type="number"
          name="costo"
          step="0.01"
          value={formData.costo}
          onChange={handleChange}
          className="w-full p-2 border-2 border-blue-800 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          required
        />
      </div>

      {/* Campo Precio */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Precio</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border-2 border-blue-800 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          required
        />
      </div>

      {/* Campo Cantidad */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Cantidad</label>
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          className="w-full p-2 border-2 border-blue-800 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          required
        />
      </div>

      {/* Campo Marca */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Marca</label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          className="w-full p-2 border-2 border-blue-800 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        />
      </div>

      {/* Campo Imagen */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Imagen del Producto</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full p-2 border-2 border-blue-800 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          accept="image/*"
          disabled={uploading}
        />
        {formData.imagen && (
          <div className="mt-2">
            <img 
              src={formData.imagen} 
              alt="Preview" 
              className="h-20 object-cover rounded border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={uploading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={uploading}
        >
          {uploading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Agregar Producto')}
        </button>
      </div>
    </form>
  );
}