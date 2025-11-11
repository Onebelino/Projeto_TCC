// src/pages/EditPoolPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePool from '../components/CreatePool.jsx'; // Importa o formulário

// Vamos usar um 'spinner' (ícone de carregamento)
import { ThreeDots } from 'react-loader-spinner'; 

function EditPoolPage() {
  const { id } = useParams(); // Pega o ID da piscina da URL
  const navigate = useNavigate();
  const [piscina, setPiscina] = useState(null); // Estado para guardar os dados
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados da piscina que queremos editar
  useEffect(() => {
    const fetchPool = async () => {
      try {
        setLoading(true);
        // Usamos a API de 'detalhe' que já existe
        const response = await axios.get(`http://127.0.0.1:8000/api/piscinas/${id}/`);
        setPiscina(response.data);
      } catch (error) {
        console.error("Erro ao buscar piscina para edição:", error);
        alert("Não foi possível carregar a piscina.");
        navigate('/minhas-piscinas'); // Volta se der erro
      }
      setLoading(false);
    };

    fetchPool();
  }, [id, navigate]);

  // 2. Função que é chamada QUANDO o formulário termina de salvar
  const handleUpdateSuccess = (piscinaAtualizada) => {
    // Redireciona de volta para o painel
    navigate('/minhas-piscinas');
  };

  // 3. Renderização
  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Piscina</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots color="#06b6d4" height={80} width={80} />
        </div>
      ) : (
        // 4. Passamos os dados da 'piscina' para o formulário
        <CreatePool 
          piscinaExistente={piscina} 
          onPoolUpdated={handleUpdateSuccess} 
        />
      )}
    </div>
  );
}

export default EditPoolPage;