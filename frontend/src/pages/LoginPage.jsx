// src/pages/LoginPage.jsx
import Login from '../components/Login.jsx';

export default function LoginPage() {
  
  // --- ✅ A CORREÇÃO ESTÁ AQUI ---
  // Este 'div' agora é o responsável por
  // centralizar o formulário na tela.
  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <Login />
    </div>
  );
  // -----------------
}