// src/components/PoolList.jsx

// --- 1. TODOS OS 'useState', 'useEffect' E 'axios' FORAM REMOVIDOS ---
import { Link } from 'react-router-dom';

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
// (A lista de ESTADOS_BRASILEIROS foi removida daqui)


// --- 2. O COMPONENTE AGORA RECEBE 'props' ---
function PoolList({ pools, loading }) {
  
  // (Toda a lógica de 'fetchPools', 'handleSearch', 'clearSearch' foi REMOVIDA)

  // --- 3. A RENDERIZAÇÃO ---
  return (
    // Removemos o 'div' principal (o 'HomePage' já cuida disso)
    // Removemos o <form> (ele agora está no HeroSearch)
    <> 
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
                    <p className="text-cyan-400 font-semibold mb-2">
                      <strong>Cidade:</strong> {pool.cidade} - {pool.estado}
                    </p>
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
    </>
  );
}

export default PoolList;