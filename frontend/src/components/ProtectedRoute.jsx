// src/components/ProtectedRoute.jsx

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

// Este é o "Segurança" GERAL.
// Ele só checa se o usuário está logado, não importa o tipo.

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext); // Lê o estado do usuário

  if (!user) {
    // Se não há usuário, chuta para o /login
    return <Navigate to="/login" replace />;
  }

  // Se está logado (Locador OU Locatário), deixa passar
  return <Outlet />;
};

export default ProtectedRoute;