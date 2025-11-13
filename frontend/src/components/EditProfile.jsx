// src/components/EditProfile.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'; 
import { toast } from 'react-toastify';

function EditProfile() {
  const [profileData, setProfileData] = useState({
    nome_completo: '',
    data_nascimento: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(true);
  const { authToken, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${authToken}` };
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', { headers });
        setProfileData({
          nome_completo: response.data.nome_completo || '',
          data_nascimento: response.data.data_nascimento || '',
          telefone: response.data.telefone || '',
        });
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        toast.error("Não foi possível carregar seu perfil.");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [authToken]); 

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const dataToSubmit = {
        ...profileData,
        data_nascimento: profileData.data_nascimento || null,
      };

      await axios.patch('http://127.0.0.1:8000/api/profile/', dataToSubmit, { headers });
      toast.success('Perfil atualizado com sucesso! (O nome na Navbar mudará no próximo login)');

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(`Erro ao salvar: ${error.response?.data || error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("ATENÇÃO!\nVocê tem certeza que quer excluir sua conta?\n\nTODOS os seus dados, piscinas e reservas serão permanentemente apagados. Esta ação NÃO pode ser desfeita.")) {
      return;
    }
    
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      await axios.delete('http://127.0.0.1:8000/api/profile/delete/', { headers });
      toast.success('Conta excluída com sucesso.');
      logoutUser(); 
      
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error(`Erro ao excluir conta: ${error.response?.data || error.message}`);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ThreeDots color="#2563eb" height={80} width={80} />
      </div>
    );
  }

  return (
    // --- ✅ TEMA LIGHT ---
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Meu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Completo:</label>
          <input type="text" name="nome_completo" value={profileData.nome_completo} onChange={handleChange} required className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Nascimento (Opcional):</label>
          <input type="date" name="data_nascimento" value={profileData.data_nascimento} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone (com DDD):</label>
          <input type="text" name="telefone" placeholder="(11) 91234-5678" value={profileData.telefone} onChange={handleChange} className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">Salvar Alterações</button>
      </form>

      <hr className="my-6 border-gray-200" />
      <div>
        <h3 className="text-lg font-bold text-red-600">Zona de Perigo</h3>
        <p className="text-sm text-gray-500 mb-4">Excluir sua conta é uma ação permanente e removerá todos os seus dados.</p>
        <button onClick={handleDeleteAccount} className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Excluir Minha Conta Permanentemente</button>
      </div>
    </div>
  );
}

export default EditProfile;