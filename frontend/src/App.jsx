// src/App.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// 1. Importe o AuthProvider AQUI
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    // 2. O AuthProvider "envelopa" o seu site AQUI
    // Isso quebra o paradoxo e corrige o erro
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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