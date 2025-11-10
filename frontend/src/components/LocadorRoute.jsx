// src/components/LocadorRoute.jsx

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

// Este componente protege as rotas que SÓ o LOCADOR pode ver

const LocadorRoute = () => {
  // Lê o 'user' do nosso contexto de autenticação
  const { user } = useContext(AuthContext); 

  // 1. O usuário está logado? E
  // 2. O 'profile_tipo' dele é 'LOCADOR'?
  if (user && user.profile_tipo === 'LOCADOR') {
    // Se sim, renderiza a página filha (ex: /dashboard)
    return <Outlet />;
  }
  
  // Se não estiver logado, ou for um LOCATÁRIO, chuta ele para a Home
  // (E 'replace' impede que ele use o botão "voltar" do navegador)
  return <Navigate to="/" replace />;
};

export default LocadorRoute;