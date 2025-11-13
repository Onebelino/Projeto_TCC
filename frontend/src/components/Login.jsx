// src/components/Login.jsx

import { useState, useContext } from 'react'; 
import axios from 'axios';
import AuthContext from '../context/AuthContext'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('E-mail ou senha inválidos!');
      } else {
        toast.error('Erro ao tentar fazer login.');
      }
    }
  };

  return (
    // --- ✅ TEMA LIGHT: Fundo branco, texto escuro ---
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Faça seu Login</h1>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Senha:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Entrar
        </button>

        <div className="text-center mt-4">
          <Link to="/esqueceu-a-senha" className="text-sm text-blue-600 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;