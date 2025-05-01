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
        costo: producto.costo ? producto.costo.toString() : '',
        price: producto.price ? producto.price.toString() : '',
        cantidad: producto.cantidad ? producto.cantidad.toString() : '',
        marca: producto.marca || '',
        imagen: producto.imagen || ''
      });
    } else {
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
    
    if (value === '') {
      setFormData(prev => ({ ...prev, [name]: '' }));
      return;
    }

    if (['costo', 'price', 'cantidad'].includes(name)) {
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        costo: formData.costo ? parseFloat(formData.costo) : 0,
        price: formData.price ? parseFloat(formData.price) : 0,
        cantidad: formData.cantidad ? parseInt(formData.cantidad) : 0,
        marca: formData.marca,
        imagen: imageUrl
      };
  
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Nombre */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Campo Costo */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm font-medium">Costo</label>
        <input
          type="text"
          name="costo"
          value={formData.costo}
          onChange={handleChange}
          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
          inputMode="decimal"
          placeholder="0.00"
        />
      </div>

      {/* Campo Precio */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm font-medium">Precio</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 text-sm text-gray-700 border border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
          inputMode="decimal"
          placeholder="0.00"
        />
      </div>

      {/* Campo Cantidad */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm font-medium">Cantidad</label>
        <input
          type="text"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
          inputMode="numeric"
        />
      </div>

      {/* Campo Marca */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm font-medium">Marca</label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          className="w-full p-2 text-sm border text-gray-700 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Campo Imagen */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm font-medium">Imagen del Producto</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
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
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          disabled={uploading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="inline-block animate-spin mr-2">↻</span>
              Guardando...
            </>
          ) : isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
      </div>
    </form>
  );
}