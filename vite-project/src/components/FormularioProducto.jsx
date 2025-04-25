import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function FormularioProducto({ onProductAgregado }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const[costo,setCosto]= useState('');
    const [cantidad, setCantidad] = useState('');
    const [marca, setMarca] = useState('');
    const [rubro, setRubro] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);

    const AgregarProducto = async () => {
        if (!name || !price || !cantidad || !marca || !rubro || !costo) {
            setMessage('Por favor, complete todos los campos');
            return;
        }

        // Validar que precio y cantidad sean números válidos
        if (isNaN(price) || isNaN(cantidad)) {
            setMessage('Por favor ingrese un valor numérico para el precio y la cantidad.');
            return;
        }

        try {
            let imagenUrl = null;
            if (image) {
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('image')
                    .upload(`${Date.now()}-${image.name}`, image);
                    console.log("Resultado del upload:", uploadData, uploadError);
                if (uploadError) throw new Error(uploadError.message);
                

                // Obtener la URL pública del archivo subido
                const baseUrl='https://nduxzxwgsoywcndrrggf.supabase.co/storage/v1/object/public/image/';
                
                imagenUrl = uploadData ? `${baseUrl}${uploadData.path.replace(/^\/+/, '')}`:null;
                console.log("URL de la imagen generaaaa:", imagenUrl);
            }
            console.log("Datos antes del insert:", {
                name, costo, price, cantidad, marca, rubro, imagen: imagenUrl
              });
            console.log('url imagen generadoa',imagenUrl);
            const { data, error } = await supabase
                .from('accecelulares')
                .insert([{
                    name,
                    costo,
                    price,
                    cantidad,
                    marca,
                    rubro,
                    imagen: imagenUrl
                }]);
                console.log("Insert completado:", data, error);

            if (error) throw new Error(error.message);

            setMessage("Producto agregado con éxito");
            setName('');
            setCosto('');
            setPrice('');
            setCantidad('');
            setMarca('');
            setRubro('');
            setImage(null);  // Limpiar la imagen
            if (onProductAgregado) onProductAgregado();

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="bg-white text-black p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold mb2">Agregar producto</h2>
            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 p-2 w-full border" />
            <input type="text" placeholder="Costo" value={costo} onChange={(e) => setCosto(e.target.value)} className="mb-2 p-2 w-full border" />
            <input type="text" placeholder="Precio venta" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 p-2 w-full border" />
            <input type="text" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="mb-2 p-2 w-full border" />
            <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="mb-2 p-2 w-full border" />
            <input type="text" placeholder="Rubro" value={rubro} onChange={(e) => setRubro(e.target.value)} className="mb-2 p-2 w-full border" />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={AgregarProducto} className="bg-green-400 hover:bg-green-600 text-white p-2 w-full rounded">
                Agregar
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
}
