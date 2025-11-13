// src/components/MyPoolsList.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

function MyPoolsList() {
  const [myPools, setMyPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext);

  const fetchMyPools = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const response = await axios.get('http://127.0.0.1:8000/api/locador/piscinas/', { headers });
      setMyPools(response.data);
    } catch (error) {
      console.error("Erro ao buscar 'Minhas Piscinas':", error);
      toast.error("Não foi possível carregar suas piscinas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authToken) {
      fetchMyPools();
    }
  }, [authToken]);

  const handleDelete = async (poolId) => {
    if (!window.confirm("Você tem certeza que quer excluir esta piscina? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      await axios.delete(`http://127.0.0.1:8000/api/piscinas/${poolId}/`, { headers });
      setMyPools(myPools.filter(pool => pool.id !== poolId));
      toast.success('Piscina excluída com sucesso!');
    } catch (error) {
      console.error("Erro ao excluir piscina:", error);
      toast.error(`Erro ao excluir: ${error.response?.data || error.message}`);
    }
  };

  if (loading) {
    return <div className="text-gray-600 text-center p-10">Carregando suas piscinas...</div>;
  }

  return (
    // --- ✅ TEMA LIGHT ---
    <div className="w-full max-w-5xl p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Minhas Piscinas Cadastradas</h1>
      
      {myPools.length === 0 ? (
        <p className="text-gray-500 text-center">Você ainda não cadastrou nenhuma piscina. <Link to="/nova-piscina" className="text-blue-600 hover:underline">Cadastre sua primeira piscina!</Link></p>
      ) : (
        <div className="space-y-4">
          {myPools.map(pool => {
            const coverImage = pool.imagens && pool.imagens.length > 0 ? pool.imagens[0].imagem : 'https://placehold.co/192x128/f3f4f6/9ca3af?text=Sem+Foto';
            
            return (
              // Card Claro
              <div key={pool.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                
                <img 
                  src={coverImage}
                  alt={pool.titulo}
                  className="w-full md:w-48 h-32 object-cover rounded-lg bg-gray-200"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{pool.titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1 uppercase">{pool.cidade} - {pool.estado}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">R$ {pool.preco_diaria} <span className="text-sm font-normal text-gray-500">/ dia</span></p>
                </div>

                <div className="flex gap-3">
                  <Link 
                    to={`/piscinas/${pool.id}/editar`}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(pool.id)}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
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