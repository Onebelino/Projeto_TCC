// src/pages/MyReservationsPage.jsx
// Esta é a página que o roteador vai carregar

import MyReservations from '../components/MyReservations.jsx';

export default function MyReservationsPage() {
  return (
    <div className="w-full flex justify-center py-10">
      <MyReservations />
    </div>
  );
}