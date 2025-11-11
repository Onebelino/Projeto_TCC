// src/components/Register.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    password2: '',
    tipo: 'LOCATARIO',
    telefone: '', 
    cpf: '',
    nome_completo: '', 
    data_nascimento: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  
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
    
    const dadosUser = {
      email: registerData.email,
      password: registerData.password,
      password2: registerData.password2,
    };
    const dadosParaApi = {
      tipo: registerData.tipo,
      user: dadosUser,
      telefone: registerData.telefone,
      cpf: registerData.cpf,
      nome_completo: registerData.nome_completo,
      data_nascimento: registerData.data_nascimento || null,
    };
    
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', dadosParaApi);
      alert('Usuário criado com sucesso! Por favor, faça o login.');
      navigate('/login');

    } catch (error) {
      if (error.response) {
        console.error('Erro do servidor:', error.response.data);
        const errorData = error.response.data;
        if (errorData.user && errorData.user.username) {
            alert(`Erro ao registrar: ${errorData.user.username[0]}`);
        } else if (errorData.user && errorData.user.email) {
            alert(`Erro ao registrar: ${errorData.user.email[0]}`);
        } else {
            alert('Erro ao registrar: ' + JSON.stringify(errorData));
        }
      } else {
        alert('Erro ao registrar.');
      }
    }
  };

  return (
    // --- ✅ A CORREÇÃO ESTÁ AQUI ---
    // Trocamos 'max-w-md' por 'max-w-lg' (mais largo)
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
    {/* --------------------------- */}
      
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Crie sua Conta</h1>
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Nome Completo:</label>
          <input
            type="text" name="nome_completo" value={registerData.nome_completo}
            onChange={handleRegisterChange} required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Data de Nascimento (Opcional):</label>
          <input
            type="date" name="data_nascimento" value={registerData.data_nascimento}
            onChange={handleRegisterChange}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Email:</label>
          <input
            type="email" name="email" value={registerData.email}
            onChange={handleRegisterChange} required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Senha:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
              className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Confirme a Senha:</label>
          <div className="relative">
            <input
              type={showPassword2 ? 'text' : 'password'}
              name="password2"
              value={registerData.password2}
              onChange={handleRegisterChange}
              required
              className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword2(!showPassword2)}
            >
              {showPassword2 ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Tipo de Conta:</label>
          <select 
            name="tipo" value={registerData.tipo} onChange={handleRegisterChange}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="LOCATARIO">Locatário (Quero alugar)</option>
            <option value="LOCADOR">Locador (Quero anunciar)</option>
          </select>
        </div>
        
        {registerData.tipo === 'LOCADOR' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300">Telefone (com DDD):</label>
              <input
                type="text" name="telefone" placeholder="(11) 91234-5678"
                value={registerData.telefone} onChange={handleRegisterChange}
                required={registerData.tipo === 'LOCADOR'} 
                className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">CPF:</label>
              <input
                type="text" name="cpf" placeholder="123.456.789-00"
                value={registerData.cpf} onChange={handleRegisterChange}
                required={registerData.tipo === 'LOCADOR'}
                className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </>
        )}
        
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