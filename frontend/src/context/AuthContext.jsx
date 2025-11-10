// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Vamos usar para ler o token
import { useNavigate } from 'react-router-dom';

// 1. Criar o Contexto
const AuthContext = createContext();

export default AuthContext;

// 2. Criar o "Provedor" (o componente que "dono" da lógica)
export const AuthProvider = ({ children }) => {

  // 3. O Estado
  // Lê o token do localStorage na primeira vez que o app carrega
  const [authToken, setAuthToken] = useState(() => 
    localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : null
  );
  
  // Se tiver token, decodifica ele para pegar os dados do usuário
  const [user, setUser] = useState(() => 
    localStorage.getItem('accessToken')
      ? jwtDecode(localStorage.getItem('accessToken'))
      : null
  );

  const navigate = useNavigate();

  // 4. Função de Login
  const loginUser = (token) => {
    // Salva o token no estado e no localStorage
    setAuthToken(token);
    localStorage.setItem('accessToken', token);
    
    // Decodifica o token e salva o usuário no estado
    setUser(jwtDecode(token));
    
    // Redireciona o usuário para a Home
    navigate('/');
  };

  // 5. Função de Logout
  const logoutUser = () => {
    // Limpa o estado e o localStorage
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); // Limpa o refresh token também
    
    // Redireciona para o login
    navigate('/login');
  };

  // 6. Dados que o Contexto vai "exportar" para os filhos
  const contextData = {
    user: user,
    authToken: authToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  // 7. O Componente Provedor
  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};