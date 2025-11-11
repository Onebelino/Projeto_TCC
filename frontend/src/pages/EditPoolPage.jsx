// src/pages/EditPoolPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePool from '../components/CreatePool.jsx'; // Importa o formulário
import { ThreeDots } from 'react-loader-spinner'; 

function EditPoolPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [piscina, setPiscina] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lógica de buscar a piscina (sem mudança)
  useEffect(() => {
    const fetchPool = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/piscinas/${id}/`);
        setPiscina(response.data);
      } catch (error) {
        console.error("Erro ao buscar piscina para edição:", error);
        alert("Não foi possível carregar a piscina.");
        navigate('/minhas-piscinas'); 
      }
      setLoading(false);
    };
    fetchPool();
  }, [id, navigate]);

  // Lógica de sucesso (sem mudança)
  const handleUpdateSuccess = (piscinaAtualizada) => {
    navigate('/minhas-piscinas');
  };

  // --- ✅ A CORREÇÃO ESTÁ AQUI ---
  // Adicionamos o "wrapper" de centralização
  // e o "card" (fundo) que estava faltando
  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Piscina</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ThreeDots color="#06b6d4" height={80} width={80} />
          </div>
        ) : (
          <CreatePool 
            piscinaExistente={piscina} 
            onPoolUpdated={handleUpdateSuccess} 
          />
        )}
      </div>
    </div>
  );
}

export default EditPoolPage;