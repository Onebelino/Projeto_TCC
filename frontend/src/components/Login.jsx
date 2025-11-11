// src/components/Login.jsx

import { useState, useContext } from 'react'; 
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const dataParaApi = {
      username: loginData.email,
      password: loginData.password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', dataParaApi);
      const accessToken = response.data.access;
      loginUser(accessToken);
      alert('Login realizado com sucesso!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('E-mail ou senha inválidos!');
      } else {
        alert('Erro ao tentar fazer login.');
      }
    }
  };

  return (
    // --- ✅ A CORREÇÃO ESTÁ AQUI ---
    // Trocamos 'max-w-md' por 'max-w-lg' (mais largo)
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
    {/* --------------------------- */}
      
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Faça seu Login</h1>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        
        {/* Campo de E-mail */}
        <div>
          <label className="block text-sm font-medium text-gray-300">E-mail:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo de Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Senha:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;