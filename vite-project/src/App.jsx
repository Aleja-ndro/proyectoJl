import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/buscador" element={<Buscador />} />
        <Route path="/Kiosko" element={<Kiosko/>}/>
        <Route path="/Login" element={<Login/>}/>
      </Routes>
    </Router>
  );
}