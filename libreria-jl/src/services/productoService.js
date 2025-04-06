export const buscarProductos=asunc(keyword)=>{
    try{
        const response= await fetch('http://localhost:8081/productos/buscar?keyword=${keyword}');
        if(!response.ok)throw new Error("Error en la busqueda");
        return await response.json();
    }catch(error){
        console.error("Error buscando productos : ",error);
        return [];
    }
    
};