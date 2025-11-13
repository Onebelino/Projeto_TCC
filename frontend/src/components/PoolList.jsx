// src/components/PoolList.jsx

import { Link } from 'react-router-dom';

// --- Estilos "Dia de Sol" (Light Mode) ---
const poolCardStyle = {
  backgroundColor: '#ffffff', // Branco
  color: '#1f2937', // Cinza escuro
  borderRadius: '12px',
  margin: '16px',
  width: '300px',
  // Sombra suave para destacar no fundo claro
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  border: '1px solid #f3f4f6', // Borda bem sutil
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const listContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover', // 'cover' fica melhor nos cards da lista
  borderRadius: '0', 
  backgroundColor: '#f3f4f6',
  borderBottom: '1px solid #e5e7eb',
};

function PoolList({ pools, loading }) {
  
  if (loading) {
    return <div className="text-gray-600 text-center text-lg animate-pulse">Carregando piscinas...</div>;
  }

  if (!loading && pools.length === 0) {
    return (
      <div className="text-gray-500 text-center text-lg mt-10">
        Nenhuma piscina encontrada para esta busca. 
        <br/><span className="text-sm">Tente mudar o filtro de cidade ou estado.</span>
      </div>
    );
  }

  return (
    <div style={listContainerStyle}>
      {pools.map(pool => {
        
        const coverImage = pool.imagens && pool.imagens.length > 0
          ? pool.imagens[0].imagem
          : null;

        return (
          <Link to={`/piscinas/${pool.id}`} key={pool.id} style={{textDecoration: 'none'}}>
            <div style={poolCardStyle} className="hover:scale-105 hover:shadow-xl">
              
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt={pool.titulo}
                  style={imageStyle} 
                />
              ) : (
                <div style={{...imageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span className="text-gray-400 font-medium">Sem Foto</span>
                </div>
              )}
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1" title={pool.titulo}>
                  {pool.titulo}
                </h3>
                
                <p className="text-blue-600 font-medium text-sm mb-3 uppercase tracking-wide">
                  {pool.cidade} - {pool.estado}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-xs text-gray-500 block">Diária</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {pool.preco_diaria}
                    </span>
                  </div>
                  
                  <span 
                    className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalhes
                  </span>
                </div>
              </div>

            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PoolList;