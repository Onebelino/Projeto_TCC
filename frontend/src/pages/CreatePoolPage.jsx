// src/pages/CreatePoolPage.jsx

import CreatePool from '../components/CreatePool.jsx';

export default function CreatePoolPage() {
  
  // --- ✅ CORREÇÃO FEITA ---
  // Removemos a div com "bg-slate-800" e o título "h2".
  // O componente <CreatePool /> agora já cuida de todo o visual (fundo branco e título).
  return (
    <div className="w-full flex-grow flex items-center justify-center py-10">
      <CreatePool />
    </div>
  );
}