import { useEffect } from "react";

export default function EjercicioUseEfect(){
    useEffect(()=>{
        console.log("!Cafeteria Abierta");

    },[]);
    return <h1 className="text-3xl font-bold text-red-500">tail funciona</h1>
    
}