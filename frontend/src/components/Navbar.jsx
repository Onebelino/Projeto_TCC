// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 text-gray-200 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        <Link to="/" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
          PiscinaFácil
        </Link>
        
        <div className="flex items-center gap-4">
          
          {/* SE 'user' existir (está logado): */}
          {user ? (
            <>
              {/* --- ✅ LÓGICA CORRIGIDA AQUI --- */}
              
              {/* 1. Links que TODOS os usuários logados veem */}
              <Link 
                to="/minhas-reservas" 
                className="font-medium hover:text-cyan-400 transition-colors"
              >
                Minhas Reservas (Cliente)
              </Link>
              <Link 
                to="/perfil" 
                className="font-medium hover:text-cyan-400 transition-colors"
              >
                Meu Perfil
              </Link>

              {/* 2. Links que SÓ O LOCADOR vê (além dos de cima) */}
              {user.profile_tipo === 'LOCADOR' && (
                <>
                  <Link 
                    to="/dashboard"
                    className="font-medium hover:text-cyan-400 transition-colors"
                  >
                    Painel (Donos)
                  </Link>
                  <Link 
                    to="/minhas-piscinas"
                    className="font-medium hover:text-cyan-400 transition-colors"
                  >
                    Minhas Piscinas
                  </Link>
                  <Link 
                    to="/nova-piscina" 
                    className="font-medium hover:text-cyan-400 transition-colors"
                  >
                    Cadastrar Piscina
                  </Link>
                </>
              )}
              {/* ------------------------------------------- */}

              {/* 3. Info do Usuário (Nome e Sair) */}
              <span className="text-gray-400">
                Olá, {user.display_name}!
              </span>

              <button 
                onClick={logoutUser} 
                className="bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
              >
                Sair (Logout)
              </button>
            </>
          ) : (
            
            // 4. Links de quem NÃO está logado
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