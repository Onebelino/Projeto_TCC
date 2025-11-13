// src/App.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      {/* --- ✅ MUDANÇA: Fundo Claro (bg-gray-50) e Texto Escuro --- */}
      <div className="bg-gray-50 min-h-screen flex flex-col text-gray-900">
        
        {/* Toast com tema claro */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" 
        />

        <Navbar />

        {/* Container principal */}
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </AuthProvider>
  );
}

export default App;