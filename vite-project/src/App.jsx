import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Buscador from './components/Buscador';
import Kiosko from './pages/Kiosko';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/buscador" element={<Buscador />} />
        <Route path="/kiosko" element={<Kiosko />} />
        <Route path="*" element={<Login />} /> {/* Ruta de fallback */}
      </Routes>
    </Router>
  );
}

export default App;