import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// 1. NÃO importamos mais o AuthProvider aqui

// 2. Importar o Layout (App)
import App from './App.jsx';

// 3. Importar as Páginas
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreatePoolPage from './pages/CreatePoolPage.jsx';

// 4. Importar o Protetor de Rotas
import LocadorRoute from './components/LocadorRoute.jsx';
import LocadorDashboardPage from './pages/LocadorDashboardPage.jsx';

// 5. Definir a estrutura de rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O "Layout"
    children: [ 
      {
        index: true, 
        element: <HomePage />,
      },
      {
        path: 'login', 
        element: <LoginPage />,
      },
      {
        path: 'register', 
        element: <RegisterPage />,
      },
      
      // Rota Protegida de Locador
      {
        element: <LocadorRoute />, 
        children: [
          {
            path: 'nova-piscina', 
            element: <CreatePoolPage />, 
          },
          {
            path: 'dashboard',
            element: <LocadorDashboardPage />,
          }
        ]
      },
    ],
  },
]);

// 6. Renderizar o aplicativo (AGORA SEM O AUTHPROVIDER)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O AuthProvider foi REMOVIDO daqui */}
    <RouterProvider router={router} />
  </React.StrictMode>,
);