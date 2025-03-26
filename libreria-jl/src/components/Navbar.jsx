import{Link} from 'react-router-dom';
import{FaShoppingCart} from 'react-icons/fa';
import{categories} from '../data/categories';

export default function Navbar(){
    return(
        <nav className='bg-blue-600 p-4 text-white shadow-md'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to="/" className='text-cl font-bold'>Libreria escolar Jl</Link>
                <div className='flex space-x-6'>
                    <Link to="/category/libreria" className='hover:underline'>Libreria</Link>
                    <Link to="/category/cotillon" className='hover:underline'>Cotillon </Link>
                    <Link to="/category/tecnologia" className='hover:underline'>Tecnologia</Link>
                    <Link to="/category/juguetes" className='hover:underline'>Juguetes</Link>
                    <Link to="/category/centro de copiado" className='hover:underline'>Centro de copiado</Link>
                    <Link to="/category/varios" className='hover:underline'>Varios</Link>
                    <Link to="/cart" className='flex items-center gap-1'>
                    <FaShoppingCart/>Carrito
                    </Link>
                </div>
            </div>
            </nav>
              );
}