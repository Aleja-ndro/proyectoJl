import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulación de autenticación con delay
        setTimeout(() => {
            if (user === "admin" && password === '123') {
                navigate("/buscador");
            } else if (user === "Nelson" && password === '12345678') {
                navigate("/Kiosko");
            } else {
                setError("Usuario o contraseña incorrectos");
                // Efecto de shake para el error
                const form = document.querySelector('.login-form');
                form.classList.add('animate-shake');
                setTimeout(() => form.classList.remove('animate-shake'), 500);
            }
            setIsLoading(false);
        }, 800);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-4">
            {/* Logo/Título */}
            <div className="mb-8 text-center transition-all duration-300 hover:scale-105">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                    <span className="text-yellow-400">JL</span> Solutions
                </h1>
                <p className="text-blue-200 text-sm sm:text-base">Sistema de acceso seguro</p>
            </div>

            {/* Tarjeta de Login */}
            <div className="w-full max-w-sm sm:max-w-md">
                <form 
                    onSubmit={handleSubmit}
                    className="login-form bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-white/20 transition-all"
                >
                    <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-blue-100">
                                Usuario
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all placeholder-gray-500"
                                    autoFocus
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-blue-100">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all placeholder-gray-500"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-300 bg-red-900/30 px-4 py-2 rounded-lg text-sm flex items-center animate-fade-in">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center transition-all
                                ${isLoading 
                                    ? 'bg-yellow-600 cursor-not-allowed' 
                                    : 'bg-yellow-500 hover:bg-yellow-400 transform hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-lg'}
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </div>

                    <div className="px-6 py-4 bg-black/10 text-center border-t border-white/10">
                        <a href="#" className="text-blue-200 hover:text-yellow-300 text-sm transition-colors inline-flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </form>
            </div>

            {/* Efecto de partículas decorativas */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white/5"
                        style={{
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}