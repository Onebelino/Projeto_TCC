// src/components/StarRating.jsx

import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Usamos estrela cheia e estrela vazia

const StarRating = ({ rating = 0, setRating, readonly = false, size = 20 }) => {
  // rating: A nota atual (0 a 5)
  // setRating: Função para mudar a nota (se for clicável)
  // readonly: Se for true, o usuário não pode clicar (apenas visualização)
  // size: O tamanho da estrela

  // Criamos um "hover" state
  const [hoverRating, setHoverRating] = useState(0);

  return (
    // --- ✅ AQUI ESTÁ A CORREÇÃO ---
    // Esta div 'flex' é a "jaula" que força a horizontalidade
    <div className="flex items-center gap-1"> 
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        
        // Decidimos a cor da estrela
        // Ela fica amarela se:
        // 1. O 'rating' (a nota clicada) for >= o valor dela
        // 2. OU se o 'hoverRating' (o mouse) for >= o valor dela
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <label key={index}>
            {/* Escondemos o 'radio button' real, é só pela lógica */}
            <input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => {
                if (!readonly && setRating) {
                  setRating(starValue);
                }
              }}
              style={{ display: 'none' }} // Esconde o radio button
            />
            
            {/* O Ícone da Estrela (cheia ou vazia) */}
            {isFilled ? (
              <FaStar
                size={size}
                className="text-yellow-400" // Cor da estrela cheia
                style={{ cursor: readonly ? 'default' : 'pointer' }}
                onMouseEnter={() => !readonly && setHoverRating(starValue)}
                onMouseLeave={() => !readonly && setHoverRating(0)}
              />
            ) : (
              <FaRegStar
                size={size}
                className="text-gray-500" // Cor da estrela vazia
                style={{ cursor: readonly ? 'default' : 'pointer' }}
                onMouseEnter={() => !readonly && setHoverRating(starValue)}
                onMouseLeave={() => !readonly && setHoverRating(0)}
              />
            )}
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;