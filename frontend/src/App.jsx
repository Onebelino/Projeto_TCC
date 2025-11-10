// src/App.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// 1. Importe o AuthProvider AQUI
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    // 2. O AuthProvider "envelopa" o seu site AQUI
    // Agora o Navbar e o Outlet (páginas) podem usar o contexto,
    // e o contexto pode usar o roteador (useNavigate).
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* 1. Navbar no topo, sempre visível */}
        <Navbar />

        {/* 2. O "recheio" (página) é injetado aqui pelo roteador */}
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Outlet />
        </main>

        {/* (Depois podemos adicionar um Footer aqui) */}
      </div>
    </AuthProvider>
  );
}

export default App;