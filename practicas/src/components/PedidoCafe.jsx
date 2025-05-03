import { useState,useEffect } from "react";
export default function PedidoCafe(){
    const [pedido,setPedido]=useState("");

    useEffect(()=>{
        if(pedido){
            console.log(`Preparando :${pedido}` );
        }
    },[pedido]);
    return(
        <div>
            <h1 className="text-xl font-semibold mb-2">Haz tu pedido:</h1>
      <button
        onClick={()=>setPedido("Capuccino")}
        className="bg-green-500">
                Capuccino
        </button>
        <button
        onClick={()=>setPedido("Expreso")}
        className="bg-red-300"
        >Expreso</button>
        {pedido && <p className="mt-2">Pedido Actual: <span className=" font-bold">{pedido}</span></p>}
        </div>
    )
    
}