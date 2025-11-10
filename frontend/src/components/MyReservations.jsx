import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';

function MyReservations() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext); 

  // Função para buscar as reservas (GET /api/reservas/)
  const fetchMyReservas = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      // Esta API (ReservaListCreateView) já está programada
      // para retornar apenas as reservas do usuário logado
      const response = await axios.get('http://127.0.0.1:8000/api/reservas/', { headers });
      setReservas(response.data);
    } catch (error) {
      console.error("Erro ao buscar minhas reservas:", error);
      alert("Não foi possível carregar suas reservas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authToken) {
      fetchMyReservas();
    }
  }, [authToken]);

  // Função para "Cancelar" (PATCH /api/reservas/<id>/cancel/)
  const handleCancelReserva = async (reservaId) => {
    if (!window.confirm("Você tem certeza que quer cancelar esta reserva?")) {
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const body = { "status": "CANCELADA" };
      
      // Usamos a nova API de 'cancel'
      await axios.patch(`http://127.0.0.1:8000/api/reservas/${reservaId}/cancel/`, body, { headers });

      // Atualiza a lista visualmente
      setReservas(reservasAnteriores => 
        reservasAnteriores.map(reserva => 
          reserva.id === reservaId ? { ...reserva, status: 'CANCELADA' } : reserva
        )
      );
      alert('Reserva cancelada com sucesso!');

    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      alert(`Erro ao cancelar reserva: ${error.response?.data || error.message}`);
    }
  };

  // Funções de ajuda para estilização
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return 'text-green-400';
      case 'PENDENTE': return 'text-yellow-400';
      case 'CANCELADA': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return <div className="text-white text-center p-10">Carregando suas reservas...</div>;
  }

  return (
    <div className="w-full max-w-4xl p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Minhas Reservas</h1>
      
      {reservas.length === 0 ? (
        <p className="text-gray-400 text-center">Você ainda não fez nenhuma reserva.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map(reserva => (
            <div key={reserva.id} className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Informações da Reserva */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-cyan-400">{reserva.piscina_titulo}</h3>
                <p className="text-gray-300">
                  <span className="font-semibold">Datas:</span> {new Date(reserva.data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                  {' até '} 
                  {new Date(reserva.data_fim).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Valor:</span> R$ {reserva.preco_total}
                </p>
              </div>

              {/* Status e Botões */}
              <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                <span className={`text-lg font-bold ${getStatusColor(reserva.status)}`}>
                  {reserva.status}
                </span>

                {/* Mostra o botão "Cancelar" apenas se ainda não foi cancelada/concluída */}
                {(reserva.status === 'PENDENTE' || reserva.status === 'CONFIRMADA') && (
                  <button 
                    onClick={() => handleCancelReserva(reserva.id)}
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-400"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;