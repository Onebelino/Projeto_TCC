// src/App.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      {/* O 'div' principal SÓ controla o fundo e a altura */}
      <div className="bg-slate-900 min-h-screen flex flex-col">
        
        <Navbar />

        {/* --- ✅ A CORREÇÃO ESTÁ AQUI --- */}
        {/* O 'main' agora NÃO centraliza. Ele só dá um padding
            para o conteúdo não colar nas bordas da tela. */}
        <main className="flex-grow container mx-auto p-4 md:p-8">
        {/* --------------------------- */}
          <Outlet />
        </main>

      </div>
    </AuthProvider>
  );
}

export default App;