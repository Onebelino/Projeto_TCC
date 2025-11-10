// src/components/LocatarioRoute.jsx

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// --- ✅ CORREÇÃO AQUI ---
// Removendo a extensão .jsx, que o Vite/esbuild não estava conseguindo "resolver"
import AuthContext from '../context/AuthContext';

// Este componente protege as rotas que SÓ o LOCATÁRIO pode ver

const LocatarioRoute = () => {
  // Lê o 'user' do nosso contexto de autenticação
  const { user } = useContext(AuthContext); 

  // 1. O usuário está logado? E
  // 2. O 'profile_tipo' dele é 'LOCATARIO'?
  if (user && user.profile_tipo === 'LOCATARIO') {
    // Se sim, renderiza a página filha (ex: /minhas-reservas)
    return <Outlet />;
  }
  
  // Se não estiver logado, ou for um LOCADOR, chuta ele para a Home
  return <Navigate to="/" replace />;
};

export default LocatarioRoute;