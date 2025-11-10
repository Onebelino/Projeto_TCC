// src/components/PoolDetail.jsx

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from '../context/AuthContext.jsx';

// --- ✅ 1. IMPORTE O CARROSSEL E O CSS DELE ---
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

function PoolDetail() {
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: poolId } = useParams(); 
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [blockedDates, setBlockedDates] = useState([]);
  const { authToken } = useContext(AuthContext);

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  useEffect(() => {
    const fetchPoolDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/piscinas/${poolId}/`);
        setPool(response.data);

        // A lógica do calendário (sem mudança)
        const reservations = response.data.reservas || [];
        const datesToBlock = [];
        reservations.forEach(reserva => {
          if (reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') {
            const dates = getDatesBetween(reserva.data_inicio, reserva.data_fim);
            datesToBlock.push(...dates); 
          }
        });
        setBlockedDates(datesToBlock); 

      } catch (error) {
        console.error("Erro ao buscar detalhes da piscina:", error);
        alert("Não foi possível encontrar esta piscina.");
        navigate('/'); 
      }
      setLoading(false);
    };
    fetchPoolDetail();
  }, [poolId, navigate]); 

  // (handleDateChange e handleSubmitReserva sem mudanças)
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end && pool) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const precoNumerico = parseFloat(pool.preco_diaria); 
      const price = diffDays * precoNumerico;
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  };

  const handleSubmitReserva = async () => {
    if (!pool || !startDate || !endDate) {
      alert("Por favor, selecione um intervalo de datas.");
      return;
    }
    if (!authToken) {
      alert("Você precisa estar logado para fazer uma reserva!");
      navigate('/login'); 
      return;
    }
    const data_inicio = startDate.toISOString().split('T')[0];
    const data_fim = endDate.toISOString().split('T')[0];
    const reservaData = {
      piscina: pool.id,
      data_inicio: data_inicio,
      data_fim: data_fim,
      preco_total: totalPrice.toFixed(2),
    };
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const response = await axios.post('http://127.0.0.1:8000/api/reservas/', reservaData, { headers });
      const novaReserva = response.data;
      alert(`Solicitação de reserva (ID: ${novaReserva.id}) enviada! Status: PENDENTE.`);
      if (pool.dono_telefone) {
        const phone = pool.dono_telefone.replace(/\D/g, '');
        const whatsappNumber = `55${phone}`;
        const message = `Olá! Acabei de solicitar a reserva (ID: ${novaReserva.id}) da piscina "${pool.titulo}" ` +
                        `para as datas de ${startDate.toLocaleDateString('pt-BR')} até ${endDate.toLocaleDateString('pt-BR')}. ` +
                        `Valor total: R$ ${novaReserva.preco_total}. Aguardo sua confirmação!`;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
      } else {
        alert("Reserva pendente! O locador será notificado.");
      }
      setStartDate(null);
      setEndDate(null);
      setTotalPrice(0);
      setBlockedDates([...blockedDates, ...getDatesBetween(data_inicio, data_fim)]);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Erro ao reservar: ' + JSON.stringify(error.response.data));
      } else {
        alert('Ocorreu um erro inesperado ao solicitar a reserva.');
      }
      console.error('Erro ao criar reserva:', error);
    }
  };


  if (loading) {
    return <div className="text-white text-center p-10">Carregando piscina...</div>;
  }
  if (!pool) {
    return <div className="text-white text-center p-10">Piscina não encontrada.</div>;
  }

  // --- O JSX (HTML) DA PÁGINA DE DETALHE ---
  return (
    <div className="w-full max-w-4xl p-8 bg-slate-800 rounded-lg shadow-lg mt-10">
      
      {/* --- ✅ 2. AQUI ENTRA O CARROSSEL --- */}
      {/* Verificamos se 'pool.imagens' existe e não está vazio */}
      {pool.imagens && pool.imagens.length > 0 ? (
        <Carousel
          showThumbs={false} // Não mostrar miniaturas
          autoPlay={true}
          infiniteLoop={true}
          showStatus={false}
          className="rounded-lg overflow-hidden mb-4"
        >
          {/* Fazemos um loop (map) na lista de imagens */}
          {pool.imagens.map(img => (
            <div key={img.id} style={{ height: '400px', backgroundColor: '#1a202c' }}>
              <img 
                src={img.imagem} 
                alt={pool.titulo} 
                style={{ height: '100%', width: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        // Placeholder se não houver fotos
        <div style={{ height: '400px', backgroundColor: '#1a202c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
          <span>Sem Foto</span>
        </div>
      )}
      {/* ------------------------------------- */}

      {/* Título e Preço (sem mudança) */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-3xl font-bold text-white">{pool.titulo}</h1>
        <span className="text-3xl font-bold text-green-400">
          R$ {pool.preco_diaria} / dia
        </span>
      </div>
      
      {/* Cidade, Endereço, Descrição (sem mudança) */}
      <p className="text-lg text-cyan-400 font-semibold mt-2">{pool.cidade}</p>
      <small className="text-gray-400">{pool.endereco}</small>
      <p className="text-gray-300 mt-6">{pool.descricao}</p>
      
      <hr className="my-6 border-slate-700" />
      
      {/* Seção de Agendamento (sem mudança) */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-4">Faça sua Reserva</h2>
          <p className="text-gray-300 mb-2">Selecione o período desejado:</p>
          <div className="bg-slate-700 p-2 rounded-lg inline-block">
            <DatePicker 
              selected={startDate} 
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              minDate={new Date()}
              inline
              excludeDates={blockedDates} 
              className="bg-slate-700 text-white" 
              calendarClassName="bg-slate-700"
              dayClassName={(date) => "text-white hover:bg-cyan-500"}
              monthClassName={() => "bg-slate-800 text-white"}
            />
          </div>
        </div>
        
        {/* Sumário da Reserva (sem mudança) */}
        <div className="w-full md:w-1/3">
          <h3 className="text-xl font-bold text-white mb-4">Resumo</h3>
          {totalPrice > 0 ? (
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-lg font-bold text-green-400 mt-3">
                Total: R$ {totalPrice.toFixed(2)}
              </p>
              <button 
                onClick={handleSubmitReserva}
                disabled={!startDate || !endDate}
                className="w-full mt-3 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition-colors disabled:bg-gray-500"
              >
                Solicitar Reserva
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Selecione as datas no calendário para ver o preço.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default PoolDetail;