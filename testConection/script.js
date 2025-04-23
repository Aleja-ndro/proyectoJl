async function buscarProductos() {
    const keyword = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '<p>Buscando...</p>';

    try {
        console.log("Enviando búsqueda:", keyword);
        const response = await fetch(`https://proyectojl.onrender.com/productos/buscar?keyword=${encodeURIComponent(keyword)}`);
        
        console.log("Respuesta recibida, status:", response.status);
        const productos = await response.json();
        console.log("Productos recibidos:", productos);

        if (!productos || productos.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron resultados</p>';
        } else {
            resultsContainer.innerHTML = `
                <p>Se encontraron ${productos.length} resultados:</p>
                <div class="productos-list">
                    ${productos.map(p => `
                        <div class="producto-item">
                            <h3>${p.descripcion}</h3>
                            <p>Código: ${p.codigo} | Precio: $${p.precioVenta}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error("Error completo:", error);
        resultsContainer.innerHTML = `
            <div class="error">
                <p>Error en la búsqueda</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}
async function agregarProducto(params) {
    const descripcion=document.getElementById('inputDescripcion').value;
    const nuevoProducto={
        descripcion:descripcion,
        precioVenta:0,
        stock:0,

    };
    try{
        const response =await fetch('https://proyectojl.onrender.com/productos/agregar',{ 
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(nuevoProducto)
         });
         if (!response.ok) throw new Error("Error al agregar")
            const resultado=await response.json();
        alert("Producto agregado: "+resultado.descripcion);
    }catch(error){
        alert("Error: "+ error.message);
    }
}