// src/components/HeroSearch.jsx

import React from 'react';

// Lista de Estados (sem mudança)
const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

function HeroSearch({ 
  searchTerm, 
  setSearchTerm, 
  selectedEstado, 
  setSelectedEstado, 
  handleSearch, 
  clearSearch 
}) {
  
  return (
    // --- ✅ MUDANÇA: Gradiente Mais Vibrante e Sombra Forte ---
    // from-blue-400 to-cyan-500 dá uma sensação de "águas claras ao sol"
    <div className="w-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg shadow-2xl p-8 md:p-12 text-center">
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
        Encontre a Piscina Perfeita
      </h1>
      <p className="text-lg text-blue-100 mb-8 drop-shadow-md">
        Busque por cidade, estado ou descrição e encontre o lugar ideal para o seu lazer.
      </p>

      {/* A Barra de Pesquisa com Efeito "Vidro/Água" */}
      <form 
        onSubmit={handleSearch} 
        // --- ✅ MUDANÇA: Fundo Semi-Transparente com Blur (efeito vidro/água) ---
        // bg-white/30 (30% opacidade), backdrop-blur-md para embaçar o que está atrás
        className="w-full max-w-3xl mx-auto bg-white/30 backdrop-blur-md p-4 rounded-lg shadow-xl flex flex-col md:flex-row items-center gap-4 border border-white/40"
      >
        
        {/* Filtro de Estado (Dropdown) */}
        <select
          name="estado"
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          // bg-white/80 para se destacar no blur
          className="w-full md:w-1/3 p-3 rounded-lg bg-white/80 text-gray-800 border border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os Estados</option>
          {ESTADOS_BRASILEIROS.map(estado => (
            <option key={estado.sigla} value={estado.sigla}>
              {estado.nome} ({estado.sigla})
            </option>
          ))}
        </select>

        {/* Filtro de Texto (Busca) */}
        <input 
          type="text"
          placeholder="Busque por título, cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:flex-1 p-3 rounded-lg bg-white/80 text-gray-800 border border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        {/* Botões - Cores mais vibrantes e sombras */}
        <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
          Buscar
        </button>
        <button type="button" onClick={clearSearch} className="w-full md:w-auto bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors shadow-lg">
          Limpar
        </button>
      </form>
    </div>
  );
}

export default HeroSearch;