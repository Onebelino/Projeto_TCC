// src/components/CreatePool.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    }
  }, [piscinaExistente]); 

  useEffect(() => {
    if (poolData.estado) {
      setLoadingCidades(true);
      const cidadeAtual = piscinaExistente?.cidade === poolData.cidade ? poolData.cidade : '';
      
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${poolData.estado}/municipios`)
        .then(response => {
          const sortedCidades = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
          setCidades(sortedCidades);
          setPoolData(prevData => ({ ...prevData, cidade: cidadeAtual }));
        })
        .catch(error => console.error("Erro ao buscar cidades do IBGE:", error))
        .finally(() => setLoadingCidades(false));
    } else {
      setCidades([]);
    }
  }, [poolData.estado, piscinaExistente]);

  const handlePoolChange = (e) => {
    setPoolData({
      ...poolData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImagens(Array.from(e.target.files)); 
  };

  const handlePoolSubmit = async (e) => {
    e.preventDefault();
    if (!poolData.cidade) {
        toast.warn("Por favor, selecione uma cidade.");
        return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Você precisa estar logado!');
      return;
    }

    const formData = new FormData();
    for (const key in poolData) {
      if (key === 'preco_diaria') {
        const precoCorrigido = poolData[key].replace(',', '.');
        formData.append(key, precoCorrigido);
      } else { 
        formData.append(key, poolData[key]);
      }
    }
    if (imagens.length > 0) {
      imagens.forEach((imagem) => {
        formData.append('upload_imagens', imagem);
      });
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      if (piscinaExistente) {
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/piscinas/${piscinaExistente.id}/`, 
          formData, 
          { headers: headers }
        );
        toast.success('Piscina atualizada com sucesso!');
        if (onPoolUpdated) onPoolUpdated(response.data);
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/piscinas/', 
          formData, 
          { headers: headers }
        );
        toast.success('Piscina cadastrada com sucesso!');
        navigate('/'); 
      }

    } catch (error) {
      console.error('Erro ao salvar piscina:', error);
      if (error.response && error.response.status === 403) {
        toast.error('Erro: Você não tem permissão para esta ação!');
      } else if (error.response && error.response.status === 401) {
        toast.error('Erro: Seu token é inválido ou expirou. Faça login novamente.');
      } else {
        toast.error(`Erro ao salvar piscina: ${JSON.stringify(error.response?.data)}`);
      }
    }
  };

  return (
    // --- ✅ TEMA LIGHT ---
    <form onSubmit={handlePoolSubmit} className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Título do Anúncio:</label>
        <input
          type="text" name="titulo" value={poolData.titulo}
          onChange={handlePoolChange} required
          className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">Estado (UF):</label>
          <select
            name="estado"
            value={poolData.estado}
            onChange={handlePoolChange}
            required
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700">Cidade:</label>
          <select
            name="cidade"
            value={poolData.cidade}
            onChange={handlePoolChange}
            required
            disabled={loadingCidades || !poolData.estado} 
            className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">
              {loadingCidades ? "Carregando..." : (poolData.estado ? "Selecione a cidade" : "Selecione um estado")}
            </option>
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
        <label className="block text-sm font-medium text-gray-700">Endereço:</label>
        <input
          type="text" name="endereco" value={poolData.endereco}
          onChange={handlePoolChange} required
          className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição:</label>
        <textarea
          name="descricao" value={poolData.descricao}
          onChange={handlePoolChange}
          className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Preço por Dia (R$):</label>
        <input
          type="text" name="preco_diaria" value={poolData.preco_diaria}
          onChange={handlePoolChange} required
          className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: 150,00"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {piscinaExistente ? "Substituir Fotos (Opcional):" : "Fotos da Piscina (Múltiplas):"}
        </label>
        <input
          type="file" name="upload_imagens"
          accept="image/*" 
          onChange={handleImageChange} 
          multiple
          className="w-full p-2 mt-1 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
        {piscinaExistente && (
            <small className="text-gray-500">Se você não enviar novas fotos, as antigas serão mantidas.</small>
        )}
      </div>
      
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        {piscinaExistente ? "Salvar Alterações" : "Cadastrar Piscina"}
      </button>
    </form>
  );
}

export default CreatePool;