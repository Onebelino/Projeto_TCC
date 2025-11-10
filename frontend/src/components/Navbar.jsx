// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useContext } from 'react'; // 1. Importe o 'useContext'
// Corrigindo o caminho do import:
import AuthContext from '../context/AuthContext.jsx'; // 2. Importe nosso Contexto

// Estilos simples para a navbar
const navStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '1rem',
  background: '#f8f8f8',
  borderBottom: '1px solid #ddd',
  width: '100%',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
  padding: '8px',
};

function Navbar() {
  
  // 3. "Escutamos" o Contexto para saber quem está logado
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        PiscinaFácil (Home)
      </Link>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        
        {/* 4. É AQUI QUE A MÁGICA ACONTECE! */}
        {/* Usamos um "operador ternário" (if/else) */}

        {/* SE 'user' existir (está logado): */}
        {user ? (
          <>
            <Link to="/nova-piscina" style={linkStyle}>
              Cadastrar Piscina
            </Link>
            {/* O botão de Logout chama a função do nosso contexto */}
            <button onClick={logoutUser} style={linkStyle}>
              Sair (Logout)
            </button>
            {/* Mostra o nome do usuário logado */}
            <span style={{ padding: '8px', color: '#555' }}>Olá, {user.username}!</span>
          </>
        ) : (
        
        /* SENÃO (NÃO está logado): */
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Registrar
            </Link>
          </>
        )}
        
      </div>
    </nav>
  );
}

export default Navbar;