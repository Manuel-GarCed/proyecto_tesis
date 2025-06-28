import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Simular proceso de autenticación
    setTimeout(() => {
      const user = username.toUpperCase();
      
      if (user === 'MANUEL' || user === 'JONATHAN') {
        // Guardar el estado de autenticación
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', user);
        setIsAuthenticated(true);
        
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        setIsLoading(false);
        setErrorMessage('Usuario no autorizado. Solo MANUEL y JONATHAN pueden acceder.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#16697a] to-[#489fb5]">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Panel izquierdo */}
          <div className="flex-1 bg-gradient-to-br from-[#16697a] to-[#489fb5] text-white relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10"></div>
            
            <div className="p-8 md:p-12 relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-6"> EcoGarden</h1>
              <p className="text-lg mb-8">
                Plataforma especializada para monitoreo y análisis de comportamientos en huertos con fines educativos.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 text-[#ffa62b]">
                    ✓
                  </div>
                  <span>Detección en tiempo real</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 text-[#ffa62b]">
                    ✓
                  </div>
                  <span>Análisis de patrones conductuales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 text-[#ffa62b]">
                    ✓
                  </div>
                  <span>Reportes personalizados</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel derecho */}
          <div className="flex-1 bg-[#ede7e3] p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#16697a] mb-8 text-center">
              Iniciar Sesión
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#489fb5]">
                  👤
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#489fb5] focus:ring-2 focus:ring-[#82c0cc] outline-none transition-all"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#489fb5]">
                  🔒
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#489fb5] focus:ring-2 focus:ring-[#82c0cc] outline-none transition-all"
                  required
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-[#489fb5] border-gray-300 rounded focus:ring-[#489fb5]"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-700">
                    Recordar usuario
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-3 px-4 rounded-xl font-semibold text-white 
                  bg-[#16697a] 
                  hover:bg-[#ffa62b] hover:text-[#16697a]
                  transform hover:-translate-y-0.5
                  transition-all duration-300
                  shadow-md hover:shadow-lg
                  ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </div>
                ) : (
                  'Acceder al sistema'
                )}
              </button>
              
              {errorMessage && (
                <div className="text-center text-red-500 py-3">
                  {errorMessage}
                </div>
              )}
            </form>
            
            <div className="mt-8 bg-white rounded-xl p-4 border-l-4 border-[#ffa62b]">
              <h4 className="font-bold text-[#16697a] mb-3">Requisitos de acceso:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Solo los usuarios <span className="font-bold text-[#16697a]">MANUEL</span> y <span className="font-bold text-[#16697a]">JONATHAN</span> pueden ingresar</li>
                <li>El nombre de usuario debe estar en <span className="font-bold text-[#16697a]">MAYÚSCULAS</span></li>
                <li>Cualquier contraseña es válida para estos usuarios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;