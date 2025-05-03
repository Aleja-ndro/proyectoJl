import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Buscador from './components/Buscador';
import Kiosko from './pages/Kiosko';
import Libreriajl from './pages/LibreriJl';
import Prueba from './pages/Prueba';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/buscador" element={<Buscador />} />
        <Route path="/kiosko" element={<Kiosko />} />
        <Route path='/Libreriajl' element={<Libreriajl/>}/>
        <Route path='/Prueba' element={<Prueba/>}/>
        <Route path="*" element={<Login />} /> {/* Ruta de fallback */}
      </Routes>
    </Router>
  );
}

export default App;