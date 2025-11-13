// src/components/LocadorDashboard.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext.jsx';
import { toast } from 'react-toastify'; 

function LocadorDashboard() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext); 

  const fetchLocadorReservas = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const response = await axios.get('http://127.0.0.1:8000/api/locador/reservas/', { headers });
      setReservas(response.data);
    } catch (error) {
      console.error("Erro ao buscar reservas do locador:", error);
      toast.error("Não foi possível carregar suas reservas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authToken) {
      fetchLocadorReservas();
    }
  }, [authToken]); 

  const handleUpdateStatus = async (reservaId, novoStatus) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const body = { "status": novoStatus };
      
      await axios.patch(`http://127.0.0.1:8000/api/reservas/${reservaId}/manage/`, body, { headers });

      setReservas(reservasAnteriores => 
        reservasAnteriores.map(reserva => 
          reserva.id === reservaId ? { ...reserva, status: novoStatus } : reserva
        )
      );
      toast.success(`Reserva ${novoStatus.toLowerCase()}!`);

    } catch (error) {
      console.error(`Erro ao ${novoStatus} reserva:`, error);
      toast.error(`Erro ao atualizar reserva: ${error.response?.data || error.message}`);
    }
  };

  // --- Estilos de Status (Light) ---
  const getStatusClasses = (status) => {
    switch (status) {
      case 'CONFIRMADA': return 'text-green-700 bg-green-100 border border-green-200';
      case 'PENDENTE': return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'CANCELADA': return 'text-red-700 bg-red-100 border border-red-200';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-gray-600 text-center p-10">Carregando seu painel...</div>;
  }

  return (
    // --- ✅ TEMA LIGHT ---
    <div className="w-full max-w-5xl p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Painel de Gerenciamento</h1>
      
      {reservas.length === 0 ? (
        <p className="text-gray-500 text-center">Você ainda não tem nenhuma reserva para suas piscinas.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map(reserva => (
            // Card Claro
            <div key={reserva.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-600">{reserva.piscina_titulo}</h3>
                <p className="text-gray-700">
                  <span className="font-semibold">Cliente:</span> {reserva.locatario_username}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-semibold">Datas:</span> {new Date(reserva.data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                  {' até '} 
                  {new Date(reserva.data_fim).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </p>
                <p className="text-gray-800 font-medium mt-1">
                  R$ {reserva.preco_total}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${getStatusClasses(reserva.status)}`}>
                  {reserva.status}
                </span>

                {reserva.status === 'PENDENTE' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(reserva.id, 'CONFIRMADA')}
                      className="bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                    >
                      Aceitar
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(reserva.id, 'CANCELADA')}
                      className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
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