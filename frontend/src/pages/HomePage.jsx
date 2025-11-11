// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import PoolList from '../components/PoolList.jsx'; // O componente "burro"
import HeroSearch from '../components/HeroSearch.jsx'; // O novo componente de busca

function HomePage() {
  // --- 1. A LÓGICA DE ESTADO AGORA MORA AQUI ---
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedEstado, setSelectedEstado] = useState('');
  
  // --- 2. A FUNÇÃO DE BUSCA AGORA MORA AQUI ---
  const fetchPools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (selectedEstado) {
        params.append('estado', selectedEstado);
      }
      
      const response = await axios.get(`http://127.0.0.1:8000/api/piscinas/?${params.toString()}`);
      setPools(response.data); 
    } catch (error) {
      console.error('Erro ao buscar piscinas:', error);
      alert('Não foi possível carregar as piscinas.');
    }
    setLoading(false);
  };

  // Roda a busca na primeira vez que carrega
  useEffect(() => {
    fetchPools();
  }, []); // Só roda na primeira vez

  // Função chamada pelo botão "Buscar"
  const handleSearch = (e) => {
    e.preventDefault(); 
    fetchPools(); // Busca com os estados atuais
  };

  // Função chamada pelo botão "Limpar"
  const clearSearch = () => {
    setSearchTerm('');
    setSelectedEstado('');
    // Precisamos "atrasar" o fetchPools para garantir que os estados limparam
    setTimeout(() => {
      fetchPools();
    }, 0);
  };

  // --- 3. A RENDERIZAÇÃO ---
  return (
    // 'w-full' para ocupar o espaço do 'container' do App.jsx
    // 'space-y-8' para dar um espaço entre o Hero e a Lista
    <div className="w-full space-y-8">
      
      {/* O Hero (passamos os estados e funções para ele) */}
      <HeroSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedEstado={selectedEstado}
        setSelectedEstado={setSelectedEstado}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
      />

      {/* A Lista (passamos os 'pools' e 'loading' para ela) */}
      <PoolList 
        pools={pools} 
        loading={loading} 
      />

    </div>
  );
}

export default HomePage;