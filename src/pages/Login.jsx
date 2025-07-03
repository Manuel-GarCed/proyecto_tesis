import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUser } from '../services/authService'
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Simular proceso de autenticación
    setTimeout(() => {
      if (validateUser(username, password)) {
        login();
        localStorage.setItem('currentUser', username.toUpperCase());
        navigate('/home')
      } else {
        setIsLoading(false)
        setErrorMessage('Usuario o contraseña incorrectos.')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cielo-oscuro to-cielo">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Panel izquierdo */}
          <div className="flex-1 bg-gradient-to-br from-cielo-oscuro to-cielo text-white relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10"></div>
            
            <div className="p-8 md:p-12 relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-6"> EcoGarden</h1>
              <p className="text-lg mb-8">
                Plataforma especializada para monitoreo y análisis de comportamientos en huertos con fines educativos.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center 
                    justify-center mr-3 text-amarillo-concreto">
                    ✓
                  </div>
                  <span>Detección en tiempo real</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center
                    justify-center mr-3 text-amarillo-concreto">
                    ✓
                  </div>
                  <span>Análisis de patrones conductuales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center
                    justify-center mr-3 text-amarillo-concreto">
                    ✓
                  </div>
                  <span>Reportes personalizados</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel derecho */}
          <div className="flex-1 bg-fondo-hueso p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-cielo-oscuro mb-8 text-center">
              Iniciar Sesión
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cielo">
                  👤
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl
                    focus:border-cielo focus:ring-2 focus:ring-cielo-claro outline-none transition-all"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cielo">
                  🔒
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl
                    focus:border-cielo focus:ring-2 focus:ring-cielo-claro outline-none transition-all"
                  required
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-cielo border-gray-300 rounded focus:ring-cielo"
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
                  w-full py-3 px-4 rounded-xl font-semibold text-fondo-hueso
                  bg-cielo-oscuro 
                  hover:bg-amarillo-concreto hover:text-cielo-oscuro
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
            
            <div className="mt-8 bg-white rounded-xl p-4 border-l-4 border-amarillo-concreto">
              <h4 className="font-bold text-color-cielo-oscuro mb-3">Requisitos de acceso:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Solo los usuarios
                  <span className="font-bold text-cielo-oscuro"> MANUEL </span> y 
                  <span className="font-bold text-cielo-oscuro"> JONATHAN </span> pueden ingresar
                </li>
                <li>El nombre de usuario debe estar en <span className="font-bold text-cielo-oscuro">MAYÚSCULAS</span></li>
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