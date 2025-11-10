// src/components/PoolList.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from '../context/AuthContext.jsx'; 

// Estilos (sem mudança)
const poolCardStyle = {
  border: '1px solid #444', 
  borderRadius: '8px',
  padding: '16px',
  margin: '16px',
  width: '300px',
  backgroundColor: '#2d3748', 
  color: '#e2e8f0', 
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
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
  borderRadius: '4px',
  marginBottom: '12px',
  backgroundColor: '#1a202c', 
};


function PoolList() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPool, setSelectedPool] = useState(null); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { authToken } = useContext(AuthContext);

  // Funções fetchPools, useEffect, handleSearch, clearSearch (sem mudança)
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
  useEffect(() => { fetchPools(); }, []); 
  const handleSearch = (e) => { e.preventDefault(); fetchPools(searchTerm); };
  const clearSearch = () => { setSearchTerm(''); fetchPools(); };
  
  // --- ATUALIZADO: Lógica de Seleção de Data ---
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Calcular o preço total
    if (start && end && selectedPool) {
      // Calcula a diferença em dias
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclui o dia de início
      
      // --- ✅ A CORREÇÃO ESTÁ AQUI ---
      // Converte o texto "150.00" para o número 150.00
      const precoNumerico = parseFloat(selectedPool.preco_diaria); 
      const price = diffDays * precoNumerico;
      // -----------------------------

      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  };
  
  const handleBookingClick = (pool) => {
    setSelectedPool(pool);
    setStartDate(null);
    setEndDate(null);
    setTotalPrice(0);
  };


  // --- ATUALIZADO: Lógica de Reserva (O Novo Fluxo) ---
  const handleSubmitReserva = async () => {
    if (!selectedPool || !startDate || !endDate) {
      alert("Por favor, selecione a piscina e um intervalo de datas.");
      return;
    }
    if (!authToken) {
      alert("Você precisa estar logado para fazer uma reserva!");
      return;
    }

    const data_inicio = startDate.toISOString().split('T')[0];
    const data_fim = endDate.toISOString().split('T')[0];
    const reservaData = {
      piscina: selectedPool.id,
      data_inicio: data_inicio,
      data_fim: data_fim,
      preco_total: totalPrice.toFixed(2), // .toFixed(2) converte para "450.00"
    };

    try {
      // 1. Criar a Reserva PENDENTE
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const response = await axios.post('http://127.0.0.1:8000/api/reservas/', reservaData, { headers });

      const novaReserva = response.data;
      alert(`Solicitação de reserva (ID: ${novaReserva.id}) enviada! Status: PENDENTE.`);

      // 2. SÓ ABRA o WhatsApp SE o telefone existir
      if (selectedPool.dono_telefone) {
        const phone = selectedPool.dono_telefone.replace(/\D/g, '');
        const whatsappNumber = `55${phone}`;
        
        const message = `Olá! Acabei de solicitar a reserva (ID: ${novaReserva.id}) da piscina "${selectedPool.titulo}" ` +
                        `para as datas de ${startDate.toLocaleDateString('pt-BR')} até ${endDate.toLocaleDateString('pt-BR')}. ` +
                        `Valor total: R$ ${novaReserva.preco_total}. Aguardo sua confirmação!`;
        
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
      } else {
        alert("Reserva pendente! O locador será notificado, mas ele não cadastrou um WhatsApp para contato imediato.");
      }

      // Limpar seleção
      setSelectedPool(null);
      setStartDate(null);
      setEndDate(null);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Agora, se der 400 (ex: datas ocupadas), vamos ver o erro certo
        alert('Erro ao reservar: ' + JSON.stringify(error.response.data));
      } else {
        alert('Ocorreu um erro inesperado ao solicitar a reserva.');
      }
      console.error('Erro ao criar reserva:', error);
    }
  };


  // --- JSX (O HTML - sem mudança) ---
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
          {pools.map(pool => (
            <div key={pool.id} style={poolCardStyle}>
              
              {pool.imagem ? (
                <img 
                  src={pool.imagem} 
                  alt={pool.titulo}
                  style={imageStyle} 
                />
              ) : (
                <div style={{...imageStyle, backgroundColor: '#1a202c', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span>Sem Foto</span>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{pool.titulo}</h3>
              <p className="text-cyan-400 font-semibold mb-2"><strong>Cidade:</strong> {pool.cidade}</p>
              
              <p className="text-lg font-bold text-green-400 mb-2">
                R$ {pool.preco_diaria} / dia
              </p>
              
              <p className="text-sm mb-3">{pool.descricao}</p>
              <small className="text-gray-400">Endereço: {pool.endereco}</small>
              
              <button 
                onClick={() => handleBookingClick(pool)}
                className="w-full mt-4 bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Ver Disponibilidade (Agendar)
              </button>

              {selectedPool && selectedPool.id === pool.id && (
                <div style={{ marginTop: '15px' }}>
                  <p className="text-white mb-2">Selecione o período:</p>
                  <DatePicker 
                    selected={startDate} 
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    minDate={new Date()}
                    inline
                    className="bg-slate-700 text-white" 
                    calendarClassName="bg-slate-700"
                    dayClassName={(date) => "text-white hover:bg-cyan-500"}
                    monthClassName={() => "bg-slate-800 text-white"}
                  />
                  
                  {totalPrice > 0 && (
                    <p className="text-lg font-bold text-green-400 mt-3">
                      Total: R$ {totalPrice.toFixed(2)}
                    </p>
                  )}

                  <button 
                    onClick={handleSubmitReserva}
                    disabled={!startDate || !endDate}
                    className="w-full mt-3 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition-colors disabled:bg-gray-500"
                  >
                    Solicitar Reserva (via WhatsApp)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PoolList;