// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './context/AuthContext.jsx';

// Layout e Páginas
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PoolDetailPage from './pages/PoolDetailPage.jsx';
import MyReservationsPage from './pages/MyReservationsPage.jsx';
import CreatePoolPage from './pages/CreatePoolPage.jsx';
import LocadorDashboardPage from './pages/LocadorDashboardPage.jsx';
import MyPoolsPage from './pages/MyPoolsPage.jsx';
import EditPoolPage from './pages/EditPoolPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; // <-- ✅ NOVO IMPORT

// Protetores de Rota
import ProtectedRoute from './components/ProtectedRoute.jsx'; // O "Segurança" GERAL
import LocatarioRoute from './components/LocatarioRoute.jsx';
import LocadorRoute from './components/LocadorRoute.jsx'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [ 
      // --- Rotas Públicas ---
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'piscinas/:id', element: <PoolDetailPage /> },
      
      // --- Rota Protegida (GERAL - QUALQUER UM LOGADO) ---
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'perfil', // <-- ✅ NOVA ROTA
            element: <ProfilePage />,
          },
          {
            path: 'minhas-reservas', 
            element: <MyReservationsPage />,
          }
        ]
      },

      // --- Rota Protegida de LOCATÁRIO (Se houver alguma) ---
      {
        element: <LocatarioRoute />, 
        children: [
          // (Vazia)
        ]
      },

      // --- Rota Protegida de LOCADOR ---
      {
        element: <LocadorRoute />,
        children: [
          { path: 'nova-piscina', element: <CreatePoolPage /> },
          { path: 'dashboard', element: <LocadorDashboardPage /> },
          { path: 'minhas-piscinas', element: <MyPoolsPage /> },
          { path: 'piscinas/:id/editar', element: <EditPoolPage /> }
        ]
      },
    ],
  },
]);

// Renderiza o App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);