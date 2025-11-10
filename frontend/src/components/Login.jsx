// src/components/Login.jsx

import { useState, useContext } from 'react'; // 1. Importe o useContext
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // 2. Importe nosso Contexto

function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // 3. Pegue a função loginUser do Contexto
  const { loginUser } = useContext(AuthContext);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', loginData);
      
      // 4. Pegue o token de acesso
      const accessToken = response.data.access;

      // 5. CHAME A FUNÇÃO DO CONTEXTO!
      // (Isso vai salvar o token, decodificar, e redirecionar)
      loginUser(accessToken);
      
      // (Não precisamos mais salvar o 'refreshToken' por enquanto)
      // localStorage.setItem('refreshToken', response.data.refresh);
      
      alert('Login realizado com sucesso!');

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Usuário ou senha inválidos!');
      } else {
        alert('Erro ao tentar fazer login.');
      }
    }
  };

  // O JSX (return) continua exatamente o mesmo de antes
  return (
    <div>
      <h1>Faça seu Login</h1>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label>Nome de Usuário:</label>
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;