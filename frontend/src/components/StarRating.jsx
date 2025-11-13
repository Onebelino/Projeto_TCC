// src/components/StarRating.jsx

import { FaStar } from 'react-icons/fa'; // Usamos o ícone de estrela que já temos

const StarRating = ({ rating, setRating, readonly = false }) => {
  // rating: A nota atual (0 a 5)
  // setRating: Função para mudar a nota (se for clicável)
  // readonly: Se for true, o usuário não pode clicar (apenas visualização)

  return (
    <div className="flex items-center gap-1"> {/* ✅ Força HORIZONTAL com Tailwind */}
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        
        return (
          <FaStar
            key={index}
            size={20}
            // Se o valor da estrela for menor ou igual a nota, pinta de amarelo
            className={starValue <= rating ? "text-yellow-400" : "text-gray-600"}
            style={{ cursor: readonly ? 'default' : 'pointer' }}
            // Se não for 'readonly', permite clicar para mudar a nota
            onClick={() => {
              if (!readonly && setRating) {
                setRating(starValue);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;