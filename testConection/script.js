async function buscarProductos() {
    const keyword = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('resultsContainer');
    
    resultsContainer.innerHTML = '<p>Buscando...</p>';

    try {
        const response = await fetch(`http://localhost:8080/productos/buscar?keyword=${encodeURIComponent(keyword)}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const productos = await response.json();
        
        if (productos.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron productos</p>';
        } else {
            resultsContainer.innerHTML = productos.map(p => `
                <div class="producto">
                    <h3>${p.descripcion}</h3>
                    <p>Precio:$ ${p.precioVenta}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error completo:', error);
        resultsContainer.innerHTML = `
            <div class="error">
                <p>Error al conectar con el servidor</p>
                <small>Detalle: ${error.message}</small>
            </div>
        `;
    }
}