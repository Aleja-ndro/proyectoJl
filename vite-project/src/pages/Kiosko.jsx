import { useActionState, useState } from "react";
import InputBusqueda from "../components/inputBusqueda";

export default function Kiosko(){
    const [productos,setProductos]=useState(
        [ 
            {id:1, name:"Auricular Samsung Original", price:800,marca:"Samsung", cantidad:10,rubro:"Auriculares"},
            {id:2,name:"Auricular Jbl", price:1200,cantidad:4,marca:"Jbl", rubro:"Auriculares"},
            {id:3,name:"Cable tipo C",price:2300,cantidad:5,marca:"Mobile", rubro:"Cables"},
            {id:4,name:"Cable V8",price:2600,cantidad:5,marca:"Mobile", rubro:"Cables"},
            {id:5,name:"Cable iphone",price:2600,cantidad:5,marca:"Mobile", rubro:"Cables"}
        ]
    )
    const [ventasDelDia,setVentasDelDia]=useState([]);
    const manejarVentas=(productoId)=>{
        setProductos((prev)=>
        prev.map((p)=>
        p.id ===productoId && p.cantidad>0
    ?{...p,cantidad:p.cantidad -1}
:p
));
    const producto= productos.find((p)=>p.id=== productoId);
    if(producto && producto.cantidad>0){
        setVentasDelDia((prev)=>[
            ...prev,
            {nombre:producto.name,precio:producto.price,fecha:new Date()}
        ]) ;    
         }
    };

    return(
        <div className="p-4 bg-blue-300 min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-4">Panel Kiosko</h1>
            <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-3 gap-4">
                {productos.map((producto)=>(
                    <ProductCard
                    key={producto.id}
                    producto={producto}
                    vender={()=>manejarVentas(producto.id)}/>
                ))}
            </div>
            <h2 className="text-xl font-bold mt-8">Ventas del dia:</h2>
            <ul className="mt-2">
                {ventasDelDia.map((venta,i)=>( 
                   <li key={i}>
                        {venta.nombre}-${venta.precio}- {venta.fecha.toLocalTimeString()}
                    </li>
                ))}              
            </ul>
        </div>
    );    
}