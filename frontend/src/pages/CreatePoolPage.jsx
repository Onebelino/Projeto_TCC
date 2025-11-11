// src/pages/CreatePoolPage.jsx
import CreatePool from '../components/CreatePool.jsx';

export default function CreatePoolPage() {
  
  // --- ✅ A CORREÇÃO ESTÁ AQUI ---
  // Adicionamos o "wrapper" de centralização
  // e o "card" (fundo) que estava faltando
  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Adicionar Nova Piscina</h2>
        <CreatePool />
      </div>
    </div>
  );
  // -----------------
}