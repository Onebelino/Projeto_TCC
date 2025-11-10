// src/App.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// 1. Importe o AuthProvider AQUI
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    // 2. O AuthProvider "envelopa" o seu site AQUI
    // Isso conserta o erro "useNavigate() may be used only in the context of a <Router>"
    // e corrige a tela branca.
    <AuthProvider>
      {/* Adicionamos o fundo "dark mode" aqui para o site todo */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#111827' /* bg-gray-900 */ }}>
        
        {/* Navbar no topo */}
        <Navbar />

        {/* O "recheio" (página) */}
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Outlet />
        </main>

      </div>
    </AuthProvider>
  );
}

export default App;