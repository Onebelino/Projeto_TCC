// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    // --- ✅ MUDANÇA: Navbar Branca com Sombra Mais Forte ---
    <nav className="bg-white text-gray-800 shadow-xl sticky top-0 z-50"> 
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo agora é 'text-blue-600' (um azul piscina mais profundo) */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-500 transition-colors">
          PiscinaFácil
        </Link>
        
        <div className="flex items-center gap-4">
          
          {user ? (
            <>
              {/* Links de Usuário Logado */}
              <Link 
                to="/minhas-reservas" 
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Minhas Reservas
              </Link>
              <Link 
                to="/perfil" 
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Meu Perfil
              </Link>

              {/* Links SÓ de LOCADOR */}
              {user.profile_tipo === 'LOCADOR' && (
                <>
                  <Link 
                    to="/dashboard"
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    Painel (Donos)
                  </Link>
                  <Link 
                    to="/minhas-piscinas"
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    Minhas Piscinas
                  </Link>
                  <Link 
                    to="/nova-piscina" 
                    className="font-medium hover:text-blue-600 transition-colors"
                  >
                    Cadastrar Piscina
                  </Link>
                </>
              )}

              {/* Texto "Olá" e Botão "Sair" */}
              <span className="text-gray-600 hidden md:block">
                Olá, {user.display_name}!
              </span>
              <button 
                onClick={logoutUser} 
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Sair (Logout)
              </button>
            </>
          ) : (
            
            // Links de Visitante (Deslogado)
            <>
              <Link 
                to="/login" 
                className="font-medium hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Registrar
              </Link>
            </>
          )}
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;