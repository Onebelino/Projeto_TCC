// src/pages/RegisterPage.jsx
// Esta página foca apenas no Registro.
import Register from '../components/Register.jsx'; // <-- CORREÇÃO: Adicionado .jsx

export default function RegisterPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Register />
    </div>
  );
}