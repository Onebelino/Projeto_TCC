// src/components/LocadorDashboard.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';

function LocadorDashboard() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext); // Pega o token para a API

  // Função para buscar as reservas do locador
  const fetchLocadorReservas = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      // Usamos a nova API que criamos no backend
      const response = await axios.get('http://127.0.0.1:8000/api/locador/reservas/', { headers });
      setReservas(response.data);
    } catch (error) {
      console.error("Erro ao buscar reservas do locador:", error);
      alert("Não foi possível carregar suas reservas.");
    }
    setLoading(false);
  };

  // Roda a função de busca quando o componente carrega
  useEffect(() => {
    if (authToken) {
      fetchLocadorReservas();
    }
  }, [authToken]); // Roda de novo se o authToken mudar

  // Função para "Aceitar" (PATCH)
  const handleUpdateStatus = async (reservaId, novoStatus) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const body = { "status": novoStatus };
      
      // Usamos a API de 'manage' que testamos no Thunder Client
      await axios.patch(`http://127.0.0.1:8000/api/reservas/${reservaId}/manage/`, body, { headers });

      // Sucesso! Agora atualiza a lista visualmente
      setReservas(reservasAnteriores => 
        reservasAnteriores.map(reserva => 
          reserva.id === reservaId ? { ...reserva, status: novoStatus } : reserva
        )
      );
      alert(`Reserva ${novoStatus.toLowerCase()}!`);

    } catch (error) {
      console.error(`Erro ao ${novoStatus} reserva:`, error);
      alert(`Erro ao atualizar reserva: ${error.response?.data || error.message}`);
    }
  };

  // --- Funções de ajuda para estilização ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMADA': return 'text-green-400';
      case 'PENDENTE': return 'text-yellow-400';
      case 'CANCELADA': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return <div className="text-white text-center p-10">Carregando seu painel...</div>;
  }

  return (
    <div className="w-full max-w-4xl p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Painel de Gerenciamento</h1>
      
      {reservas.length === 0 ? (
        <p className="text-gray-400 text-center">Você ainda não tem nenhuma reserva para suas piscinas.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map(reserva => (
            <div key={reserva.id} className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Informações da Reserva */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-cyan-400">{reserva.piscina_titulo}</h3>
                <p className="text-gray-300">
                  <span className="font-semibold">Cliente:</span> {reserva.locatario_username}
                </p>
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

                {/* Mostra os botões apenas se a reserva estiver PENDENTE */}
                {reserva.status === 'PENDENTE' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(reserva.id, 'CONFIRMADA')}
                      className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-400"
                    >
                      Aceitar
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(reserva.id, 'CANCELADA')}
                      className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-400"
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocadorDashboard;