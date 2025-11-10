// src/components/Register.jsx

import { useState, useContext } from 'react'; // Importe o useContext
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Importe o Contexto
import { useNavigate } from 'react-router-dom';

function Register() {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    tipo: 'LOCATARIO',
    telefone: '', // Campo para o telefone
    cpf: '',      // Campo para o cpf
  });
  
  // (Nós não usamos o loginUser aqui, então podemos remover)
  // const { loginUser } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.password2) {
      alert('As senhas não conferem!');
      return;
    }
    
    // 1. Preparar os dados do usuário
    const dadosUser = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      password2: registerData.password2,
    };

    // 2. Preparar os dados do perfil
    const dadosParaApi = {
      tipo: registerData.tipo,
      user: dadosUser,
      telefone: registerData.telefone, // Envia o telefone
      cpf: registerData.cpf,          // Envia o cpf
    };
    
    // 3. REMOVEMOS A LÓGICA DE 'DELETE' DAQUI
    // (Esta era a causa provável do bug)

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', dadosParaApi);
      alert('Usuário criado com sucesso! Por favor, faça o login.');
      navigate('/login'); // Redireciona para o login após o sucesso

    } catch (error) {
      if (error.response) {
        console.error('Erro do servidor:', error.response.data);
        alert('Erro ao registrar: ' + JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error('Erro de rede:', error.message);
        alert('Erro de conexão: O servidor do backend não está respondendo!');
      } else {
        console.error('Erro:', error.message);
        alert('Erro: ' + error.message);
      }
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Crie sua Conta</h1>
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        
        {/* Campo Username */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Nome de Usuário:</label>
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleRegisterChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Email:</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Senha:</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo Confirmar Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Confirme a Senha:</label>
          <input
            type="password"
            name="password2"
            value={registerData.password2}
            onChange={handleRegisterChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campos Telefone e CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Telefone (com DDD):</label>
          <input
            type="text"
            name="telefone"
            placeholder="(11) 91234-5678"
            value={registerData.telefone}
            onChange={handleRegisterChange}
            // (Obrigatório apenas se for locador)
            required={registerData.tipo === 'LOCADOR'} 
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">CPF:</label>
          <input
            type="text"
            name="cpf"
            placeholder="123.456.789-00"
            value={registerData.cpf}
            onChange={handleRegisterChange}
            // (Obrigatório apenas se for locador)
            required={registerData.tipo === 'LOCADOR'}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo Tipo de Usuário */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Eu sou:</label>
          <select 
            name="tipo" 
            value={registerData.tipo} 
            onChange={handleRegisterChange}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="LOCATARIO">Locatário (Quero alugar)</option>
            <option value="LOCADOR">Locador (Quero anunciar)</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default Register;