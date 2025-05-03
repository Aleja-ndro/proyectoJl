export const formatearFecha=(fecha)=>{
    return new Date(fecha).toLocaleDateString('es-ES',{
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    });
}