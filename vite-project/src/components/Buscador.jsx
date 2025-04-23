import { useState } from "react"
import {useNavigate } from "react-router-dom";
import InputBusqueda from "./inputBusqueda";
import{useState,useEffect} from "react";
export default function Buscador(){

    const [busqueda, setBusqueda]= useState("")
    const [resultados,setResultados]=useState([])
    const navigate=useNavigate();
    const handleLogout=()=>{navigate('/')};
    const [seleccionados, setSeleccionados]=useState([])
   
    const manejarSeleccion =(producto)=>{
        if(!seleccionados.some((p)=>p.name=== producto.name)){
            setSeleccionados([...seleccionados,producto])
        }
    };

    const productosDisponibles=[
        {name:'lapicera',price:1200},
        {name:'cuaderno',price:2500},
        {name:'mochila',price:5000},
        {name:'mochila con carro',price:8000},
        {name:'resaltador',price:400}]
 
    const buscarProductos=()=>{
        const encontrados=productosDisponibles.filter(
            (producto)=>producto.name.toLowerCase().includes(busqueda.toLowerCase())
            )
            setResultados(encontrados)

                    }
    const total= seleccionados.reduce((acum,producto)=>{
        return acum +producto.price;
    },0)

    
    useEffect(()=>{
        const encontrados =productosDisponibles.filter(
            (producto)=>
                producto.name.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()));
            setResultados(encontrados);
    },[busqueda]);

    
    return(
        <div className="container grid grid-cols-3 gap-4">
         <h1 className="text-2x1 font-bold mb-4">Busca tu articulo</h1>
      <InputBusqueda
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      buscarProductos={buscarProductos}
      />

            <div>
                {resultados.map((producto, index)=>(
                    <div 
                        key={index} 
                        onClick={()=>manejarSeleccion(producto)}
                        className={`p-2 m-1 rounded cursor-pointer
                            ${seleccionados.includes(producto)? 'bg-yellow-400': 'bg-green-300'}
                            hover:bg-green `}>
                                 <div className="bg=blue ">
                         {producto.name}-${producto.price}
                         </div>
                       
                     </div>
                     
                ))}
                <div className="mt-4 p-4 bg-gray-400 rounded">
                    <h2 className="text-xl font-bold mb-2">Seleccionados</h2> 
                    {seleccionados.map((producto,index)=>(
                            <div
                            key={index}
                            className="p-2 boreder-b">
                                {producto.name}-${producto.price}
                            </div>
                            
                    ))}
                    <div>
                        Total = ${total}
                    </div>

                </div>
          
            </div>
            
            <button
                onClick={handleLogout}
                className="bg-blue-400 rounded w-10"
                > Salir</button>

        </div>
    )
}