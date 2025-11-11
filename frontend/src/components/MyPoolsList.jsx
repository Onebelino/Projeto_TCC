// src/components/MyPoolsList.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom'; // Para o botão "Editar"

function MyPoolsList() {
  const [myPools, setMyPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext);

  // 1. Função para buscar as piscinas do Locador
  const fetchMyPools = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      // Usamos a nova API que criamos no backend
      const response = await axios.get('http://127.0.0.1:8000/api/locador/piscinas/', { headers });
      setMyPools(response.data);
    } catch (error) {
      console.error("Erro ao buscar 'Minhas Piscinas':", error);
      alert("Não foi possível carregar suas piscinas.");
    }
    setLoading(false);
  };

  // 2. Roda a busca quando o componente carrega
  useEffect(() => {
    if (authToken) {
      fetchMyPools();
    }
  }, [authToken]);

  // 3. Função para EXCLUIR uma piscina
  const handleDelete = async (poolId) => {
    // Pergunta de confirmação
    if (!window.confirm("Você tem certeza que quer excluir esta piscina? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      // Usamos a API 'DELETE' que testamos no Thunder Client
      await axios.delete(`http://127.0.0.1:8000/api/piscinas/${poolId}/`, { headers });

      // Sucesso! Atualiza a lista na tela (removendo a piscina)
      setMyPools(myPools.filter(pool => pool.id !== poolId));
      alert('Piscina excluída com sucesso!');

    } catch (error) {
      console.error("Erro ao excluir piscina:", error);
      alert(`Erro ao excluir: ${error.response?.data || error.message}`);
    }
  };

  if (loading) {
    return <div className="text-white text-center p-10">Carregando suas piscinas...</div>;
  }

  return (
    <div className="w-full max-w-5xl p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Minhas Piscinas Cadastradas</h1>
      
      {myPools.length === 0 ? (
        <p className="text-gray-400 text-center">Você ainda não cadastrou nenhuma piscina. <Link to="/nova-piscina" className="text-cyan-400 hover:underline">Cadastre sua primeira piscina!</Link></p>
      ) : (
        <div className="space-y-4">
          {myPools.map(pool => {
            const coverImage = pool.imagens && pool.imagens.length > 0 ? pool.imagens[0].imagem : null;
            
            return (
              <div key={pool.id} className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4">
                
                {/* Imagem */}
                <img 
                  src={coverImage || 'https://via.placeholder.com/150'} // 'via.placeholder.com' é um placeholder
                  alt={pool.titulo}
                  className="w-full md:w-48 h-32 object-cover rounded-md bg-slate-700"
                />

                {/* Informações da Piscina */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{pool.titulo}</h3>
                  <p className="text-gray-400">{pool.cidade} - {pool.estado}</p>
                  <p className="text-lg font-bold text-green-400">R$ {pool.preco_diaria} / dia</p>
                </div>

                {/* Botões de Ação (CRUD) */}
                <div className="flex gap-2">
                  <Link 
                    to={`/piscinas/${pool.id}/editar`} // <-- (Etapa 2, faremos depois)
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-400"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(pool.id)}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-400"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyPoolsList;