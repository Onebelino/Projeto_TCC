// src/pages/HomePage.jsx
// Esta página mostra a lista de piscinas e o filtro.
import PoolList from '../components/PoolList.jsx'; // <-- CORREÇÃO: Adicionado .jsx

export default function HomePage() {
  return (
    <div className="bg-blue-500 text-white p-4 w-full">
      {/* (Depois podemos adicionar um banner de boas-vindas aqui) */}
      <PoolList />
    </div>
  );
}