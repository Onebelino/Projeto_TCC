// src/components/PoolList.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// (Removemos DatePicker e AuthContext daqui)

// Estilos
const poolCardStyle = {
  border: '1px solid #444', 
  borderRadius: '8px',
  margin: '16px',
  width: '300px',
  backgroundColor: '#2d3748', 
  color: '#e2e8f0', 
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  overflow: 'hidden', // Para a imagem arredondada funcionar
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
  borderRadius: '0', // A imagem em si não é mais arredondada
  backgroundColor: '#1a202c',
  borderBottom: '1px solid #444',
};


function PoolList() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchPools = async (cidade = '') => {
    try {
      setLoading(true);
      let url = 'http://127.0.0.1:8000/api/piscinas/';
      if (cidade) {
        url += `?cidade=${cidade}`;
      }
      const response = await axios.get(url);
      setPools(response.data); 
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar piscinas:', error);
      alert('Não foi possível carregar as piscinas.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []); 

  const handleSearch = (e) => {
    e.preventDefault(); 
    fetchPools(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchPools();
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Piscinas Disponíveis</h2>

      {/* Formulário de Busca */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center gap-2">
        <input 
          type="text"
          placeholder="Digite a cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
        />
        <button type="submit" className="bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors">Buscar</button>
        <button type="button" onClick={clearSearch} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Limpar</button>
      </form>

      
      {loading && <div className="text-white text-center">Carregando piscinas...</div>}

      {!loading && pools.length === 0 && (
        <div className="text-white text-center">Nenhuma piscina encontrada para esta cidade.</div>
      )}

      {!loading && pools.length > 0 && (
        <div style={listContainerStyle}>
          {pools.map(pool => {
            
            // --- ✅ LÓGICA DA IMAGEM DE CAPA ---
            // 'pool.imagens' agora é um array
            // Pegamos a primeira imagem (se existir)
            const coverImage = pool.imagens && pool.imagens.length > 0
              ? pool.imagens[0].imagem // A URL da primeira imagem
              : null;
            // ------------------------------------

            return (
              <Link to={`/piscinas/${pool.id}`} key={pool.id} style={{textDecoration: 'none'}}>
                <div style={poolCardStyle} className="hover:scale-105 transition-transform">
                  
                  {/* --- MOSTRA A IMAGEM DE CAPA --- */}
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
                  {/* ----------------------------- */}
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{pool.titulo}</h3>
                    <p className="text-cyan-400 font-semibold mb-2"><strong>Cidade:</strong> {pool.cidade}</p>
                    
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