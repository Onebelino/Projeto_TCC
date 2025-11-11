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
import CreatePoolPage from './pages/CreatePoolPage.jsx';
import LocadorDashboardPage from './pages/LocadorDashboardPage.jsx';
import MyReservationsPage from './pages/MyReservationsPage.jsx';
import PoolDetailPage from './pages/PoolDetailPage.jsx';
import MyPoolsPage from './pages/MyPoolsPage.jsx';
import EditPoolPage from './pages/EditPoolPage.jsx';

// --- Imports dos "Seguranças" ---
import ProtectedRoute from './components/ProtectedRoute.jsx'; // O "Segurança" GERAL
import LocatarioRoute from './components/LocatarioRoute.jsx'; // O "Segurança" SÓ Locatário
import LocadorRoute from './components/LocadorRoute.jsx';   // O "Segurança" SÓ Locador

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
      
      // --- ✅ A CORREÇÃO ESTÁ AQUI ---
      // Rota Protegida (GERAL - QUALQUER UM LOGADO)
      {
        element: <ProtectedRoute />, // <-- O "Segurança" GERAL
        children: [
          {
            path: 'minhas-reservas', // <-- "Minhas Reservas" agora mora aqui!
            element: <MyReservationsPage />,
          }
          // (No futuro, "Editar Perfil" também iria aqui)
        ]
      },
      
      // --- Rota Protegida de LOCATÁRIO (Se houver alguma) ---
      {
        element: <LocatarioRoute />, 
        children: [
          // (Agora está vazia, o que é correto)
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