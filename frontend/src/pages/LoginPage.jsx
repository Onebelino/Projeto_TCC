// src/pages/LoginPage.jsx
// Esta página foca apenas no Login.
import Login from '../components/Login.jsx'; // <-- CORREÇÃO: Adicionado .jsx

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Login />
    </div>
  );
}