export default function TestTailwind() {
    return (
      <div className="p-6 space-y-4 bg-gray-100 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-600">Test de Tailwind</h2>
        <p className="underline text-gray-700">Este párrafo debería tener texto gris y estar bien espaciado.</p>
  
        <div className="space-x-4 bg-pink-300 border">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Botón Azul</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Botón Verde</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Botón Rojo</button>
        </div>
      </div>
    );
  }
  