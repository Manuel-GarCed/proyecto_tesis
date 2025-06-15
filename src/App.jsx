import './App.css';
import Sidebar from './components/sidebar';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">
        {/* Aquí va el contenido dinámico (Home, Dashboard, etc.) */}
        <h1 className="text-2xl font-bold">Bienvenido al sistema de Tesis</h1>
      </main>
    </div>
  );
}

export default App;
