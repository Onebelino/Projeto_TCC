// src/pages/CreatePoolPage.jsx
// Esta página foca apenas no formulário de criar piscina.
import CreatePool from '../components/CreatePool.jsx'; // <-- CORREÇÃO: Adicionado .jsx

export default function CreatePoolPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <CreatePool />
    </div>
  );
}