// src/components/PoolList.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Estilos (sem mudança)
const poolCardStyle = {
  border: '1px solid #444', 
  borderRadius: '8px',
  margin: '16px',
  width: '300px',
  backgroundColor: '#2d3748', 
  color: '#e2e8f0', 
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  overflow: 'hidden', 
};
const listContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
};
const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'contain', 
  borderRadius: '0', 
  backgroundColor: '#1a202c',
  borderBottom: '1px solid #444',
};
// --- ✅ Lista de Estados (para o filtro) ---
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


function PoolList() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- ✅ ATUALIZAÇÃO DOS FILTROS ---
  const [searchTerm, setSearchTerm] = useState(''); // Para a busca por texto
  const [selectedEstado, setSelectedEstado] = useState(''); // Para o dropdown de estado

  
  const fetchPools = async () => {
    try {
      setLoading(true);
      
      // --- ✅ LÓGICA DE FILTRO ATUALIZADA ---
      // Usa URLSearchParams para construir a URL (ex: ?search=Terra&estado=SP)
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm); // O filtro "contém"
      }
      if (selectedEstado) {
        params.append('estado', selectedEstado); // O filtro "exato"
      }
      
      const response = await axios.get(`http://127.0.0.1:8000/api/piscinas/?${params.toString()}`);
      // ------------------------------------
      
      setPools(response.data); 
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar piscinas:', error);
      alert('Não foi possível carregar as piscinas.');
      setLoading(false);
    }
  };

  // Roda a busca na primeira vez que carrega
  useEffect(() => {
    fetchPools();
  }, []); 

  // Função chamada pelo botão "Buscar"
  const handleSearch = (e) => {
    e.preventDefault(); 
    fetchPools(); // A fetchPools agora lê o searchTerm e o selectedEstado
  };

  // Função chamada pelo botão "Limpar"
  const clearSearch = () => {
    setSearchTerm('');
    setSelectedEstado('');
    // Precisamos "atrasar" o fetchPools para garantir que os estados limparam
    // (Isso é um truque comum do React)
    setTimeout(() => {
      fetchPools();
    }, 0);
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Encontre a Piscina Perfeita</h2>

      {/* --- ✅ FORMULÁRIO DE BUSCA ATUALIZADO --- */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row justify-center items-center gap-2">
        
        {/* Filtro de Estado (Dropdown) */}
        <select
          name="estado"
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
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
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 md:w-1/3"
        />
        
        {/* Botões */}
        <button type="submit" className="bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors">Buscar</button>
        <button type="button" onClick={clearSearch} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Limpar</button>
      </form>
      {/* ------------------------------------------- */}

      
      {loading && <div className="text-white text-center">Carregando piscinas...</div>}

      {!loading && pools.length === 0 && (
        <div className="text-white text-center">Nenhuma piscina encontrada para esta busca.</div>
      )}

      {!loading && pools.length > 0 && (
        <div style={listContainerStyle}>
          {pools.map(pool => {
            const coverImage = pool.imagens && pool.imagens.length > 0
              ? pool.imagens[0].imagem
              : null;

            return (
              <Link to={`/piscinas/${pool.id}`} key={pool.id} style={{textDecoration: 'none'}}>
                <div style={poolCardStyle} className="hover:scale-105 transition-transform">
                  
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt={pool.titulo}
                      style={imageStyle} 
                    />
                  ) : (
                    <div style={{...imageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span>Sem Foto</span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{pool.titulo}</h3>
                    {/* --- ✅ MOSTRANDO O ESTADO NO CARD --- */}
                    <p className="text-cyan-400 font-semibold mb-2">
                      <strong>Cidade:</strong> {pool.cidade} - {pool.estado}
                    </p>
                    {/* --------------------------------- */}
                    
                    <p className="text-lg font-bold text-green-400 mb-2">
                      R$ {pool.preco_diaria} / dia
                    </p>
                    
                    <button 
                      className="w-full mt-4 bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg"
                    >
                      Ver Detalhes
                    </button>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PoolList;