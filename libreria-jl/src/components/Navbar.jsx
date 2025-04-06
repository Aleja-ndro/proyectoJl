import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import './App.css';
import { buscarProductos } from '../services/productoService';
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const [searchTerm, set]
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/category/:id' element={<Category/>}/>
      </Routes>
    </Router>
    
  );
}

export default Navbar;
