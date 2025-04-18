import { useState } from "react";
import { useNavigate }from 'react-router-dom'

export default function Login(){
    const navigate=useNavigate()
    const [user,setUser]= useState ("")
    const [password,setPassword]= useState("")
    const [error,setError]=useState('');
    

    const chequeo=()=>{
        if(user==="admin" && password ==='123'){
                navigate("/buscador")
        }if(user==="Nelson" && password ==='12345678'){
            navigate("/Kiosko")
        }
        else{
            setError("User o password no valido ")
        }
        
    }
    return(
        <div className="bg-gradient-to-r from-blue-950 to-blue-500 h-screen flex flex-col items-center m-1" >
             <h1 className="font-mono text-9xl text-white font">JL 
                Solution</h1>
        <div className="container flex flex-col items-center bg-gradient-to-r from-blue-950 to-blue-500 gap-3">
           
            <input
            type="text"
            placeholder="User"
            value={user}
            onChange={(e)=>setUser(e.target.value)}
            className="border p-2 rounded w-80 bg-white text-black"
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border p-2 rounded w-80 bg-white text-black"
            />
            <button
            onClick={chequeo}
            className="bg-yellow-500 rounded w-80"
            >Iniciar</button>
            <p>{error}</p>

        </div>
        </div>
    )

}
