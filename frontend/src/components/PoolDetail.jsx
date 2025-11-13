// src/components/PoolDetail.jsx

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from '../context/AuthContext';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { toast } from 'react-toastify'; 
import StarRating from './StarRating'; // ✅ Usando nosso componente corrigido

function PoolDetail() {
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: poolId } = useParams(); 
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [blockedDates, setBlockedDates] = useState([]);
  
  const [reviews, setReviews] = useState([]); 
  const [avgRating, setAvgRating] = useState(0); 
  const [userRating, setUserRating] = useState(5); 
  const [userComment, setUserComment] = useState('');

  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyText, setReplyText] = useState('');
  
  const { authToken, user } = useContext(AuthContext);

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

  const fetchPoolData = async () => {
    setLoading(true);
    try {
      const poolResponse = await axios.get(`http://127.0.0.1:8000/api/piscinas/${poolId}/`);
      setPool(poolResponse.data);
      const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/avaliacoes/?piscina=${poolId}`);
      setReviews(reviewsResponse.data);
      
      const reservations = poolResponse.data.reservas || [];
      const datesToBlock = [];
      reservations.forEach(reserva => {
        if (reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') {
          const dates = getDatesBetween(reserva.data_inicio, reserva.data_fim);
          datesToBlock.push(...dates); 
        }
      });
      setBlockedDates(datesToBlock); 
      
      if (reviewsResponse.data.length > 0) {
        const total = reviewsResponse.data.reduce((acc, review) => acc + review.nota, 0);
        setAvgRating(Math.round(total / reviewsResponse.data.length));
      } else {
        setAvgRating(0);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Não foi possível encontrar esta piscina.");
      navigate('/'); 
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPoolData();
  }, [poolId, navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!authToken) { toast.error("Faça login para avaliar."); return; }
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const reviewData = { piscina: poolId, nota: userRating, comentario: userComment };
      await axios.post('http://127.0.0.1:8000/api/avaliacoes/', reviewData, { headers });
      toast.success("Avaliação enviada com sucesso!");
      setUserComment(''); setUserRating(5);   
      fetchPoolData(); 
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Você precisa ter uma reserva CONFIRMADA nesta piscina para avaliá-la.");
      } else if (error.response && error.response.data.non_field_errors) {
        toast.error("Você já avaliou esta piscina!");
      } else {
        toast.error("Erro ao enviar avaliação.");
      }
    }
  };

  const handleSubmitReply = async (avaliacaoId) => {
    if (!replyText.trim()) return;
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      await axios.patch(`http://127.0.0.1:8000/api/avaliacoes/${avaliacaoId}/responder/`, 
        { resposta: replyText }, { headers }
      );
      toast.success("Resposta enviada!");
      setReplyingTo(null); setReplyText('');
      fetchPoolData(); 
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar resposta.");
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start); setEndDate(end);
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
    if (!pool || !startDate || !endDate) { toast.warn("Selecione um intervalo de datas."); return; }
    if (!authToken) { toast.error("Você precisa estar logado!"); navigate('/login'); return; }
    
    const data_inicio = startDate.toISOString().split('T')[0];
    const data_fim = endDate.toISOString().split('T')[0];
    const reservaData = {
      piscina: pool.id, data_inicio, data_fim, preco_total: totalPrice.toFixed(2),
    };

    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const response = await axios.post('http://127.0.0.1:8000/api/reservas/', reservaData, { headers });
      const novaReserva = response.data;
      
      toast.success(`Solicitação (ID: ${novaReserva.id}) enviada! Status: PENDENTE.`);

      if (pool.dono_telefone) {
        const phone = pool.dono_telefone.replace(/\D/g, '');
        const whatsappNumber = `55${phone}`;
        const message = `Olá! Solicitei a reserva (ID: ${novaReserva.id}) da piscina "${pool.titulo}" ` +
                        `de ${startDate.toLocaleDateString('pt-BR')} até ${endDate.toLocaleDateString('pt-BR')}. ` +
                        `Valor: R$ ${novaReserva.preco_total}. Aguardo confirmação!`;
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
      } else {
        toast.info("Reserva pendente! O locador será notificado.");
      }
      
      setStartDate(null); setEndDate(null); setTotalPrice(0);
      setBlockedDates([...blockedDates, ...getDatesBetween(data_inicio, data_fim)]);

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      if (error.response && error.response.status === 400) {
        toast.error('Erro ao reservar: ' + JSON.stringify(error.response.data));
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    }
  };

  if (loading) { return <div className="text-gray-600 text-center p-10">Carregando piscina...</div>; }
  if (!pool) { return <div className="text-gray-600 text-center p-10">Piscina não encontrada.</div>; }

  const isLocador = user && user.profile_tipo === 'LOCADOR';
  const isOwner = isLocador && String(pool.dono) === String(user.user_id);

  return (
    // --- ✅ TEMA LIGHT ---
    <div className="w-full max-w-6xl p-8 bg-white rounded-2xl shadow-xl mt-10 mb-10 border border-gray-100">
      
      {/* Carrossel */}
      {pool.imagens && pool.imagens.length > 0 ? (
        <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true} showStatus={false} className="rounded-xl overflow-hidden mb-6 shadow-md">
          {pool.imagens.map(img => (
            <div key={img.id} style={{ height: '450px', backgroundColor: '#f3f4f6' }}>
              <img src={img.imagem} alt={pool.titulo} style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
            </div>
          ))}
        </Carousel>
      ) : (
        <div style={{ height: '400px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
          <span className="text-gray-400 font-bold text-xl">Sem Foto</span>
        </div>
      )}

      {/* Título e Preço */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{pool.titulo}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            {/* ✅ Usando o componente caseiro */}
            <StarRating rating={avgRating} readonly={true} />
            <span className="text-gray-500 font-medium">({reviews.length} avaliações)</span>
          </div>

          <p className="text-xl text-blue-600 font-semibold mt-2 uppercase tracking-wide">
            {pool.cidade} - {pool.estado}
          </p>
          <small className="text-gray-500 block">{pool.endereco}</small>
        </div>

        <div className="mt-4 md:mt-0 bg-green-50 px-6 py-3 rounded-lg border border-green-100">
          <span className="text-gray-500 block text-sm text-right">Valor da diária</span>
          <span className="text-4xl font-bold text-green-600">
            R$ {pool.preco_diaria}
          </span>
        </div>
      </div>
      
      {/* Descrição */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Sobre este lugar</h3>
        <p className="text-gray-700 leading-relaxed">{pool.descricao}</p>
      </div>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Agendamento */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Calendário */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Disponibilidade</h2>
          <p className="text-gray-500 mb-4">Selecione a data de entrada e saída no calendário abaixo.</p>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block">
            <DatePicker 
              selected={startDate} 
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              minDate={new Date()}
              inline
              excludeDates={blockedDates} 
              // Sem classes customizadas, usando o CSS global
            />
          </div>
        </div>
        
        {/* Sumário */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo da Reserva</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Diária:</span>
                <span>R$ {pool.preco_diaria}</span>
              </div>
              {startDate && endDate && (
                <div className="flex justify-between text-sm">
                  <span>Dias selecionados:</span>
                  <span>{Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} dias</span>
                </div>
              )}
            </div>
            <hr className="my-4 border-gray-200"/>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {totalPrice > 0 ? totalPrice.toFixed(2) : "0.00"}
              </span>
            </div>
            <button 
              onClick={handleSubmitReserva} 
              disabled={!startDate || !endDate} 
              className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Solicitar Reserva (WhatsApp)
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Você não será cobrado agora.</p>
          </div>
        </div>
      </div>
      
      <hr className="my-10 border-gray-200" />
      
      {/* Avaliações */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">O que dizem os clientes</h2>
        
        {authToken && !isLocador && (
          <div className="mb-10 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Avalie sua experiência</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Sua Nota:</label>
                {/* ✅ Componente caseiro (clicável) */}
                <StarRating rating={userRating} setRating={setUserRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Seu Comentário:</label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white text-gray-800 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Conte como foi sua experiência..."
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Enviar Avaliação
              </button>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">Esta piscina ainda não tem avaliações.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-gray-900 block text-lg">{review.autor_nome}</span>
                    <div className="mt-1">
                      {/* ✅ Componente caseiro (leitura) */}
                      <StarRating rating={review.nota} readonly={true} />
                    </div>
                  </div>
                  <small className="text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                    {new Date(review.criado_em).toLocaleDateString('pt-BR')}
                  </small>
                </div>
                
                <p className="text-gray-700 mt-2">"{review.comentario}"</p>

                {review.resposta && (
                  <div className="mt-4 ml-4 pl-4 border-l-4 border-blue-200 bg-white p-3 rounded-r-lg">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Resposta do Proprietário</p>
                    <p className="text-gray-600 text-sm">{review.resposta}</p>
                  </div>
                )}

                {isOwner && !review.resposta && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {replyingTo === review.id ? (
                      <div className="mt-2">
                        <textarea 
                          className="w-full p-2 rounded bg-white text-gray-800 text-sm border border-gray-300 mb-2 focus:ring-blue-500"
                          placeholder="Escreva sua resposta..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleSubmitReply(review.id)} className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-green-600">Enviar</button>
                          <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="bg-gray-400 text-white text-xs font-bold py-1 px-3 rounded hover:bg-gray-500">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingTo(review.id)} className="text-blue-600 text-sm font-semibold hover:underline">Responder</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default PoolDetail;