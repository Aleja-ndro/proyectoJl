import{FaFacebook,FaInstagram} from "react-icons/fa"

export default function Footer(){
    return(
        <footer className="sticky top-[100vh] bg-gray-800 text-white pt-3 pb-2">
            <div className="container px-4 ">
                <div className="flex flex-col md:flex-row justify-between items-center mb-0">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2x1 font-bold">Libreria Jl </h2>
                        <p className="text-gray-400 mt-2">Los mejores productos y el mejor precio</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-300 hover:text-white transition">
                            <FaFacebook size={24}/>
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white transition">
                            <FaInstagram size={24}/>
                        </a>
                    </div>
                </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-8 mb-8 items-start" >
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Comapnia</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Nosostros</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white ">Contactanos</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white ">Contactanos</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Preguntas Frecuentes</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Soporte</a></li>
                            </ul>
                        </div>
                    </div>
                    
            </div>
        </footer>
        
    );
}