// src/components/ProtectedRoute.jsx

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Este componente é um "wrapper"
// Se o usuário não estiver logado, ele redireciona para /login
// Se estiver logado, ele renderiza o <Outlet /> (a página filha)

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext); // Lê o estado do usuário

  if (!user) {
    // Se não há usuário, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  // Se houver um usuário, renderiza a página que ele tentou acessar
  return <Outlet />;
};

export default ProtectedRoute;