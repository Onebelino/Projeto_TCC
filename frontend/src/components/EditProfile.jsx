// src/components/EditProfile.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'; // Spinner

function EditProfile() {
  const [profileData, setProfileData] = useState({
    nome_completo: '',
    data_nascimento: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(true);
  const { authToken, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Busca os dados ATUAIS do perfil quando a página carrega
  useEffect(() => {
    if (!authToken) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${authToken}` };
        // Usamos a API 'GET /api/profile/' que testamos
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', { headers });
        
        // Preenche o formulário com os dados do backend
        setProfileData({
          nome_completo: response.data.nome_completo || '',
          data_nascimento: response.data.data_nascimento || '',
          telefone: response.data.telefone || '',
        });
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        alert("Não foi possível carregar seu perfil.");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [authToken]); // Roda quando o 'authToken' estiver disponível

  // 2. Lida com a mudança nos inputs
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Lida com o "Salvar" (PATCH)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      
      // Prepara os dados (envia 'null' se a data estiver vazia)
      const dataToSubmit = {
        ...profileData,
        data_nascimento: profileData.data_nascimento || null,
      };

      // Usamos a API 'PATCH /api/profile/' que testamos
      await axios.patch('http://127.0.0.1:8000/api/profile/', dataToSubmit, { headers });
      
      alert('Perfil atualizado com sucesso! (Pode ser necessário logar novamente para ver o nome na Navbar atualizado)');
      // (O token JWT não é atualizado automaticamente, 
      // então o 'Olá, [Nome]' na navbar só muda no próximo login)

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(`Erro ao salvar: ${error.response?.data || error.message}`);
    }
  };

  // 4. Lida com o "Excluir Conta" (DELETE)
  const handleDeleteAccount = async () => {
    if (!window.confirm("ATENÇÃO!\nVocê tem certeza que quer excluir sua conta?\n\nTODOS os seus dados, piscinas e reservas serão permanentemente apagados. Esta ação NÃO pode ser desfeita.")) {
      return;
    }
    
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      // Usamos a API 'DELETE /api/profile/delete/' que testamos
      await axios.delete('http://127.0.0.1:8000/api/profile/delete/', { headers });
      
      alert('Conta excluída com sucesso.');
      // Força o logout (pois o usuário não existe mais)
      logoutUser(); 
      
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert(`Erro ao excluir conta: ${error.response?.data || error.message}`);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ThreeDots color="#06b6d4" height={80} width={80} />
      </div>
    );
  }

  // 5. O Formulário (JSX)
  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome Completo */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Nome Completo:</label>
          <input
            type="text"
            name="nome_completo"
            value={profileData.nome_completo}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Data de Nascimento (Opcional):</label>
          <input
            type="date"
            name="data_nascimento"
            value={profileData.data_nascimento}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Campo Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Telefone (com DDD):</label>
          <input
            type="text"
            name="telefone"
            placeholder="(11) 91234-5678"
            value={profileData.telefone}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        
        {/* Botão de Salvar */}
        <button 
          type="submit"
          className="w-full bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
        >
          Salvar Alterações
        </button>
      </form>

      {/* --- Seção de Perigo (Excluir Conta) --- */}
      <hr className="my-6 border-slate-700" />
      <div>
        <h3 className="text-lg font-bold text-red-400">Zona de Perigo</h3>
        <p className="text-sm text-gray-400 mb-4">Excluir sua conta é uma ação permanente e removerá todos os seus dados.</p>
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
        >
          Excluir Minha Conta Permanentemente
        </button>
      </div>
    </div>
  );
}

export default EditProfile;