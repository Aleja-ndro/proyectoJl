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
    price: '',
    cantidad: '',
    marca: '',
    imagen: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (producto && isEditing) {
      setFormData({
        name: producto.name || '',
        price: producto.price || '',
        cantidad: producto.cantidad || '',
        marca: producto.marca || '',
        imagen: producto.imagen || ''
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
      
      // Mostrar preview de la imagen
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, img_url: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Subir imagen si hay un archivo seleccionado
    if (file) {
      setUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('productos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('productos')
          .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, imagen: publicUrl }));
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error al subir la imagen');
        setUploading(false);
        return;
      }
    }

    onProductAgregado({
      ...formData,
      price: parseFloat(formData.price),
      cantidad: parseInt(formData.cantidad)
    });
    
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Precio</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Cantidad</label>
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Marca</label>
        <input
          type="text"
          name="categoria"
          value={formData.marca}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-800"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Imagen del Producto</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full p-2 border rounded text-gray-800"
          accept="image/*"
          disabled={uploading}
        />
        {formData.imagen && (
          <div className="mt-2">
            <img 
              src={formData.imagen} 
              alt="Preview" 
              className="h-20 object-cover rounded"
            />
          </div>
        )}
      </div>
      
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