// src/components/ForgotPassword.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    cpf: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast.warn("As novas senhas não conferem!");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password-reset/', {
        email: formData.email,
        cpf: formData.cpf,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      toast.success(response.data.message || "Senha alterada com sucesso!");
      navigate('/login'); 

    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          toast.error(errorData.email[0]);
        } else if (errorData.cpf) {
          toast.error(errorData.cpf[0]);
        } else if (errorData.non_field_errors) {
          toast.error(errorData.non_field_errors[0]);
        } else {
          toast.error("Dados inválidos. Verifique seu e-mail e CPF.");
        }
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    // --- ✅ TEMA LIGHT ---
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Redefinir Senha</h1>
      <p className="text-gray-600 text-center mb-4">
        Digite seu e-mail e CPF cadastrados para definir uma nova senha.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail:</label>
          <input
            type="email" name="email" value={formData.email}
            onChange={handleChange} required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CPF:</label>
          <input
            type="text" name="cpf" placeholder="123.456.789-00"
            value={formData.cpf} onChange={handleChange} required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <hr className="border-gray-200" />

        <div>
          <label className="block text-sm font-medium text-gray-700">Nova Senha:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange} required
              className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirme a Nova Senha:</label>
          <div className="relative">
            <input
              type={showPassword2 ? 'text' : 'password'}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange} required
              className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}>
              {showPassword2 ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Redefinir Senha
        </button>
        
        <div className="text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Lembrou a senha? Voltar para o Login
          </Link>
        </div>

      </form>
    </div>
  );
}

export default ForgotPassword;