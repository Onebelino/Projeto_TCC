// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

  const [authToken, setAuthToken] = useState(() => 
    localStorage.getItem('accessToken')
      ? localStorage.getItem('accessToken')
      : null
  );
  
  const [user, setUser] = useState(() => 
    localStorage.getItem('accessToken')
      ? jwtDecode(localStorage.getItem('accessToken'))
      : null
  );

  const navigate = useNavigate();

  const loginUser = (token) => {
    setAuthToken(token);
    localStorage.setItem('accessToken', token);
    
    // --- ✅ O "ESPIÃO" ESTÁ AQUI ---
    // Vamos "imprimir" o conteúdo do novo token no console
    console.log("NOVO TOKEN RECEBIDO:", jwtDecode(token));
    // -----------------------------

    setUser(jwtDecode(token));
    navigate('/');
  };

  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const contextData = {
    user: user,
    authToken: authToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};