// src/components/CreatePool.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePool() {
  const navigate = useNavigate(); 

  const [poolData, setPoolData] = useState({
    titulo: '',
    descricao: '',
    cidade: '',
    endereco: '',
    preco_diaria: '100.00',
    imagem: null, 
  });

  // Lida com inputs de texto e números
  const handlePoolChange = (e) => {
    setPoolData({
      ...poolData,
      [e.target.name]: e.target.value,
    });
  };

  // Lida especificamente com o input de arquivo
  const handleImageChange = (e) => {
    setPoolData({
      ...poolData,
      imagem: e.target.files[0], // Pega o primeiro arquivo selecionado
    });
  };

  const handlePoolSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Você precisa estar logado como Locador para criar uma piscina!');
      return;
    }

    // FormData é necessário para enviar arquivos (imagem)
    const formData = new FormData();
    for (const key in poolData) {
      if (key === 'imagem' && poolData[key]) {
        formData.append(key, poolData[key]);
      } 
      else if (key !== 'imagem') { 
        formData.append(key, poolData[key]);
      }
    }

    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        // Não defina o 'Content-Type', o axios faz isso por nós com o FormData
      };
      
      await axios.post(
        'http://127.0.0.1:8000/api/piscinas/', 
        formData, 
        { headers: headers }
      );

      alert('Piscina cadastrada com sucesso!');
      setPoolData({ titulo: '', descricao: '', cidade: '', endereco: '', preco_diaria: '100.00', imagem: null });
      navigate('/'); 

    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('Erro: Você não tem permissão de LOCADOR para fazer isso!');
      } else if (error.response && error.response.status === 401) {
        alert('Erro: Seu token é inválido ou expirou. Faça login novamente.');
      } else {
        alert('Erro ao cadastrar piscina.');
        // Isso vai nos mostrar o erro 400 (validação) se ele ainda acontecer
        console.error('Erro ao criar piscina:', error.response?.data || error.message);
      }
    }
  };

  // --- O FORMULÁRIO (JJSX) ---
  // Agora com todos os campos de volta!
  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Adicionar Nova Piscina</h2>
      <form onSubmit={handlePoolSubmit} className="space-y-4">
        
        {/* --- OS CAMPOS QUE FALTAVAM --- */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Título do Anúncio:</label>
          <input
            type="text"
            name="titulo"
            value={poolData.titulo}
            onChange={handlePoolChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={poolData.cidade}
            onChange={handlePoolChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Endereço:</label>
          <input
            type="text"
            name="endereco"
            value={poolData.endereco}
            onChange={handlePoolChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Descrição:</label>
          <textarea
            name="descricao"
            value={poolData.descricao}
            onChange={handlePoolChange}
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        {/* ----------------------------- */}

        <div>
          <label className="block text-sm font-medium text-gray-300">Preço por Dia (R$):</label>
          <input
            type="number"
            name="preco_diaria"
            value={poolData.preco_diaria}
            onChange={handlePoolChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            step="0.01"
            min="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Foto Principal (Opcional):</label>
          <input
            type="file"
            name="imagem"
            accept="image/*" 
            onChange={handleImageChange} 
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400"
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
        >
          Cadastrar Piscina
        </button>
      </form>
    </div>
  );
}

export default CreatePool;
