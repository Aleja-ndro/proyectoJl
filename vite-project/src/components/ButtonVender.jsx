export default function ButtonVender({onVender}){
function handlerClick(){
    onVender();
    console.log("Vendido");
}
    return( 
        <div>
            <button
            className="bg-green-300"
             type="submit"
             onClick={handlerClick}
            >
                Vender 
            </button>
        </div>
    )
}