// src/pages/TermosDeUsoPage.jsx

import { Link } from 'react-router-dom';

export default function TermosDeUsoPage() {
  return (
    <div className="w-full flex justify-center py-10 px-4">
      {/* --- ✅ MUDANÇA: Card Branco com Sombra --- */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-gray-100">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
        
        {/* Área de rolagem com fundo cinza claro */}
        <div className="space-y-4 mb-8 h-96 overflow-y-auto p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 leading-relaxed">
          <p><strong>1. Aceitação dos Termos</strong><br/>Ao acessar e usar o PiscinaFácil, você aceita e concorda em cumprir estes termos.</p>
          <p><strong>2. Idade Mínima</strong><br/>Você deve ter pelo menos 18 anos de idade para criar uma conta e alugar piscinas.</p>
          <p><strong>3. Responsabilidades do Locador</strong><br/>O Locador é responsável pela veracidade das informações da piscina e pela segurança do local.</p>
          <p><strong>4. Responsabilidades do Locatário</strong><br/>O Locatário compromete-se a zelar pelo patrimônio durante o período de locação.</p>
          <p><strong>5. Cancelamentos</strong><br/>Cancelamentos devem ser feitos com antecedência mínima definida na plataforma.</p>
          <p><strong>6. Pagamentos</strong><br/>O PiscinaFácil atua apenas como intermediário de agendamento. Pagamentos são combinados diretamente entre as partes.</p>
          <p><strong>7. Uso Adequado</strong><br/>É proibido usar a plataforma para fins ilícitos ou que violem direitos de terceiros.</p>
          <p><strong>8. Alterações nos Termos</strong><br/>Podemos alterar estes termos a qualquer momento. O uso continuado do site implica em aceitação.</p>
        </div>

        <p className="text-center text-sm text-gray-500">
          (Pode fechar esta aba para voltar ao cadastro)
        </p>

      </div>
    </div>
  );
}