// src/components/CreatePool.jsx

import { useState, useEffect } from 'react'; // 1. Importe useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// --- ✅ 2. O COMPONENTE AGORA ACEITA 'props' ---
// 'piscinaExistente' será os dados da piscina que queremos editar
// 'onPoolUpdated' é uma função para avisar a página de edição que terminamos
function CreatePool({ piscinaExistente = null, onPoolUpdated }) {
  const navigate = useNavigate(); 

  const [poolData, setPoolData] = useState({
    titulo: '',
    descricao: '',
    cidade: '',
    estado: '', 
    endereco: '',
    preco_diaria: '100.00',
  });
  const [imagens, setImagens] = useState([]); 
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  
  // --- ✅ 3. VERIFICA SE ESTAMOS NO MODO "EDITAR" ---
  // Se 'piscinaExistente' for passada, preenche o formulário
  useEffect(() => {
    if (piscinaExistente) {
      setPoolData({
        titulo: piscinaExistente.titulo,
        descricao: piscinaExistente.descricao,
        cidade: piscinaExistente.cidade,
        estado: piscinaExistente.estado,
        endereco: piscinaExistente.endereco,
        preco_diaria: piscinaExistente.preco_diaria,
      });
      // (Nota: Não estamos carregando as imagens existentes para edição, 
      // pois isso é mais complexo. O 'PATCH' não vai apagar as fotos antigas.)
    }
  }, [piscinaExistente]); // Roda quando 'piscinaExistente' carregar

  // --- O "ESPIÃO" DO IBGE (sem mudança) ---
  useEffect(() => {
    if (poolData.estado) {
      setLoadingCidades(true);
      // Se a cidade já for a correta (do modo de edição), não limpe
      const cidadeAtual = piscinaExistente?.cidade === poolData.cidade ? poolData.cidade : '';
      
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${poolData.estado}/municipios`)
        .then(response => {
          const sortedCidades = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
          setCidades(sortedCidades);
          // Define a cidade correta se ela veio da edição
          setPoolData(prevData => ({ ...prevData, cidade: cidadeAtual }));
        })
        .catch(error => console.error("Erro ao buscar cidades do IBGE:", error))
        .finally(() => setLoadingCidades(false));
    } else {
      setCidades([]);
    }
  }, [poolData.estado, piscinaExistente]); // Roda se o estado mudar ou a piscina carregar
  // ---------------------------------

  const handlePoolChange = (e) => {
    setPoolData({
      ...poolData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImagens(Array.from(e.target.files)); 
  };

  // --- ✅ 4. ATUALIZAMOS A LÓGICA DE SUBMIT ---
  const handlePoolSubmit = async (e) => {
    e.preventDefault();
    if (!poolData.cidade) {
        alert("Por favor, selecione uma cidade.");
        return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Você precisa estar logado!');
      return;
    }

    const formData = new FormData();
    for (const key in poolData) {
      formData.append(key, poolData[key]);
    }
    if (imagens.length > 0) {
      imagens.forEach((imagem) => {
        formData.append('upload_imagens', imagem);
      });
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // --- A MÁGICA DO "CRUD" ---
      if (piscinaExistente) {
        // MODO EDITAR (PATCH)
        // Usamos a API 'PATCH' que testamos no Thunder Client
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/piscinas/${piscinaExistente.id}/`, 
          formData, 
          { headers: headers }
        );
        alert('Piscina atualizada com sucesso!');
        if (onPoolUpdated) onPoolUpdated(response.data); // Avisa a página "pai"
      } else {
        // MODO CRIAR (POST)
        await axios.post(
          'http://127.0.0.1:8000/api/piscinas/', 
          formData, 
          { headers: headers }
        );
        alert('Piscina cadastrada com sucesso!');
        navigate('/'); // Volta para a Home
      }
      // --------------------------

    } catch (error) {
      // (bloco catch sem mudança)
      if (error.response && error.response.status === 403) {
        alert('Erro: Você não tem permissão para esta ação!');
      } else if (error.response && error.response.status === 401) {
        alert('Erro: Seu token é inválido ou expirou. Faça login novamente.');
      } else {
        alert('Erro ao salvar piscina.');
        console.error('Erro ao salvar piscina:', error.response?.data || error.message);
      }
    }
  };

  // --- 5. O JSX (FORMULÁRIO ATUALIZADO) ---
  return (
    // (O 'div' principal foi removido, pois a página "pai" vai controlar o estilo)
    <form onSubmit={handlePoolSubmit} className="space-y-4 w-full max-w-md">
      
      {/* (Campos do formulário - sem mudança na estrutura, só nos 'values') */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Título do Anúncio:</label>
        <input
          type="text" name="titulo" value={poolData.titulo}
          onChange={handlePoolChange} required
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-300">Estado (UF):</label>
          <select
            name="estado"
            value={poolData.estado}
            onChange={handlePoolChange}
            required
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">Selecione...</option>
            {ESTADOS_BRASILEIROS.map(estado => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.sigla}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-2/3">
          <label className="block text-sm font-medium text-gray-300">Cidade:</label>
          <select
            name="cidade"
            value={poolData.cidade}
            onChange={handlePoolChange}
            required
            disabled={loadingCidades || !poolData.estado} 
            className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
          >
            <option value="">
              {loadingCidades ? "Carregando..." : (poolData.estado ? "Selecione a cidade" : "Selecione um estado")}
            </option>
            {/* Se estiver editando, pode mostrar a cidade antes de carregar o resto */}
            {piscinaExistente && cidades.length === 0 && poolData.cidade && (
                 <option value={poolData.cidade}>{poolData.cidade}</option>
            )}
            {cidades.map(cidade => (
              <option key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300">Endereço:</label>
        <input
          type="text" name="endereco" value={poolData.endereco}
          onChange={handlePoolChange} required
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Descrição:</label>
        <textarea
          name="descricao" value={poolData.descricao}
          onChange={handlePoolChange}
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Preço por Dia (R$):</label>
        <input
          type="number" name="preco_diaria" value={poolData.preco_diaria}
          onChange={handlePoolChange} required
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
          step="0.01" min="0.00"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300">
          {piscinaExistente ? "Substituir Fotos (Opcional):" : "Fotos da Piscina (Múltiplas):"}
        </label>
        <input
          type="file" name="upload_imagens"
          accept="image/*" 
          onChange={handleImageChange} 
          multiple
          className="w-full p-2 mt-1 rounded bg-slate-700 text-white border border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400"
        />
        {piscinaExistente && (
            <small className="text-gray-400">Se você não enviar novas fotos, as antigas serão mantidas.</small>
        )}
      </div>
      
      {/* --- ✅ 6. O BOTÃO AGORA É DINÂMICO --- */}
      <button 
        type="submit"
        className="w-full bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-md"
      >
        {piscinaExistente ? "Salvar Alterações" : "Cadastrar Piscina"}
      </button>
    </form>
  );
}

export default CreatePool;