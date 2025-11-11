
// src/components/HeroSearch.jsx

import React from 'react';

// A lista de estados (precisamos dela aqui para o dropdown)
const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  // ... (vou omitir os outros por brevidade, mas você pode colar a lista completa)
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

// O componente recebe os 'props' (estados e funções) do "pai" (HomePage.jsx)
function HeroSearch({ 
  searchTerm, 
  setSearchTerm, 
  selectedEstado, 
  setSelectedEstado, 
  handleSearch, 
  clearSearch 
}) {
  
  return (
    // A seção "Hero" (fundo escuro, padding grande)
    <div className="w-full bg-slate-800 rounded-lg shadow-lg p-8 md:p-12 text-center">
      
      {/* A "Frase" que você pediu */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Encontre a Piscina Perfeita
      </h1>
      <p className="text-lg text-slate-300 mb-8">
        Busque por cidade, estado ou descrição e encontre o lugar ideal para o seu lazer.
      </p>

      {/* A Barra de Pesquisa "Estilizada" */}
      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-3xl mx-auto bg-slate-700 p-4 rounded-lg shadow-inner flex flex-col md:flex-row items-center gap-4"
      >
        
        {/* Filtro de Estado (Dropdown) */}
        <select
          name="estado"
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          // Estilo maior e com "efeito"
          className="w-full md:w-1/3 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
          // Estilo maior e com "efeito"
          className="w-full md:flex-1 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        
        {/* Botões */}
        <button type="submit" className="w-full md:w-auto bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-colors shadow-md">
          Buscar
        </button>
        <button type="button" onClick={clearSearch} className="w-full md:w-auto bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-500 transition-colors">
          Limpar
        </button>
      </form>
    </div>
  );
}

export default HeroSearch;