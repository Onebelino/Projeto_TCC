// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 text-gray-200 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo/Home Link */}
        <Link to="/" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
          PiscinaFácil
        </Link>
        
        {/* Menu Links */}
        <div className="flex items-center gap-4">
          
          {/* SE 'user' existir (está logado): */}
          {user ? (
            <>
              {/* --- ✅ LÓGICA ATUALIZADA AQUI --- */}
              {/* Mostra links SÓ se for LOCADOR */}
              {user.profile_tipo === 'LOCADOR' && (
                <>
                  <Link 
                    to="/dashboard" // O NOVO LINK
                    className="font-medium hover:text-cyan-400 transition-colors"
                  >
                    Meu Painel
                  </Link>
                  <Link 
                    to="/nova-piscina" 
                    className="font-medium hover:text-cyan-400 transition-colors"
                  >
                    Cadastrar Piscina
                  </Link>
                </>
              )}

              {/* Olá, Usuário */}
              <span className="text-gray-400">
                Olá, {user.username}!
              </span>

              {/* Botão de Logout */}
              <button 
                onClick={logoutUser} 
                className="bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
              >
                Sair (Logout)
              </button>
            </>
          ) : (
          
          /* SENÃO (NÃO está logado): */
            <>
              <Link 
                to="/login" 
                className="font-medium hover:text-cyan-400 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
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