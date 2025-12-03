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

  // --- ✅ 1. NOVA LÓGICA DE CONFIRMAÇÃO PARA SALVAR ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o envio direto

    const MsgConfirmacaoSalvar = ({ closeToast }) => (
      <div className="text-sm">
        <p className="font-bold mb-2 text-gray-800">Salvar alterações?</p>
        <p className="text-gray-600 mb-3">Seus dados de perfil serão atualizados.</p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => confirmSave(closeToast)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs font-bold"
          >
            Sim, Salvar
          </button>
          <button 
            onClick={closeToast}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-xs font-bold"
          >
            Cancelar
          </button>
        </div>
      </div>
    );

    toast(<MsgConfirmacaoSalvar />, { 
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      icon: "💾"
    });
  };

  const confirmSave = async (closeToast) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const dataToSubmit = {
        ...profileData,
        data_nascimento: profileData.data_nascimento || null,
      };

      await axios.patch('http://127.0.0.1:8000/api/profile/', dataToSubmit, { headers });
      
      closeToast();
      toast.success('Perfil atualizado com sucesso! (O nome na Navbar mudará no próximo login)');

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(`Erro ao salvar: ${error.response?.data || error.message}`);
    }
  };
  // -----------------------------------------------------

  // --- Lógica de Exclusão de Conta (Mantida do passo anterior) ---
  const handleDeleteAccount = () => {
    const MsgConfirmacaoConta = ({ closeToast }) => (
      <div className="text-sm">
        <p className="font-bold mb-2 text-red-700">ATENÇÃO: EXCLUIR CONTA?</p>
        <p className="text-gray-700 mb-3">
          Todos os seus dados, piscinas e reservas serão apagados <strong>permanentemente</strong>.
        </p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => confirmDeleteAccount(closeToast)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs font-bold"
          >
            Confirmar Exclusão
          </button>
          <button 
            onClick={closeToast}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-xs font-bold"
          >
            Cancelar
          </button>
        </div>
      </div>
    );

    toast(<MsgConfirmacaoConta />, { 
      position: "top-center", autoClose: false, closeOnClick: false, draggable: false, icon: "⚠️"
    });
  };

  const confirmDeleteAccount = async (closeToast) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      await axios.delete('http://127.0.0.1:8000/api/profile/delete/', { headers });
      closeToast();
      toast.success('Conta excluída.');
      setTimeout(() => logoutUser(), 1500);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error(`Erro ao excluir: ${error.response?.data || error.message}`);
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
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Meu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Completo:</label>
          <input type="text" name="nome_completo" value={profileData.nome_completo} onChange={handleChange} required className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Nascimento:</label>
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