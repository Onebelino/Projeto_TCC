// src/components/Register.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
  const [aceitouTermos, setAceitouTermos] = useState(false);
  
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!aceitouTermos) {
      toast.warn("Você deve ler e aceitar os termos de uso para continuar.");
      return;
    }
    if (registerData.password !== registerData.password2) {
      toast.warn('As senhas não conferem!');
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
      toast.success('Usuário criado com sucesso! Por favor, faça o login.');
      navigate('/login');

    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.data_nascimento) {
             toast.error(`Erro: ${errorData.data_nascimento[0]}`); 
        } else if (errorData.cpf) {
             toast.error(`Erro no CPF: ${errorData.cpf[0]}`);
        } else if (errorData.user && errorData.user.email) {
            toast.error(`Erro: ${errorData.user.email[0]}`);
        } else {
            toast.error('Erro ao registrar: ' + JSON.stringify(errorData));
        }
      } else {
        toast.error('Erro ao registrar.');
      }
    }
  };

  return (
    // --- ✅ TEMA LIGHT ---
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Crie sua Conta</h1>
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Completo:</label>
          <input
            type="text" name="nome_completo" value={registerData.nome_completo}
            onChange={handleRegisterChange} required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Nascimento:</label>
          <input
            type="date" name="data_nascimento" value={registerData.data_nascimento}
            onChange={handleRegisterChange} required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email" name="email" value={registerData.email}
            onChange={handleRegisterChange} required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone (com DDD):</label>
          <input
            type="text" name="telefone" placeholder="(11) 91234-5678"
            value={registerData.telefone} onChange={handleRegisterChange}
            required 
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CPF:</label>
          <input
            type="text" name="cpf" placeholder="123.456.789-00"
            value={registerData.cpf} onChange={handleRegisterChange}
            required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Senha:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} name="password" value={registerData.password}
              onChange={handleRegisterChange} required
              className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirme a Senha:</label>
          <div className="relative">
            <input
              type={showPassword2 ? 'text' : 'password'} name="password2" value={registerData.password2}
              onChange={handleRegisterChange} required
              className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}>
              {showPassword2 ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Conta:</label>
          <select 
            name="tipo" value={registerData.tipo} onChange={handleRegisterChange}
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="LOCATARIO">Locatário (Quero alugar)</option>
            <option value="LOCADOR">Locador (Quero anunciar)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox" id="termos" checked={aceitouTermos}
            onChange={(e) => setAceitouTermos(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="termos" className="text-sm text-gray-700">
            Li e aceito os <Link to="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">termos de uso</Link>.
          </label>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default Register;