import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  // Asegúrate de importar Login
import Buscador from './components/Buscador';  // Asegúrate de importar Buscador
import Kiosko from './pages/kiosko';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/buscador" element={<Buscador />} />
        <Route path='/Kiosko' element={<Kiosko/>}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;
