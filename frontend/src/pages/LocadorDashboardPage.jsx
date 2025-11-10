// src/pages/LocadorDashboardPage.jsx
// Esta é a página que o roteador vai carregar

import LocadorDashboard from '../components/LocadorDashboard.jsx';

export default function LocadorDashboardPage() {
  return (
    <div className="w-full flex justify-center py-10">
      <LocadorDashboard />
    </div>
  );
}