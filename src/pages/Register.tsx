import React, { useState } from 'react';
import api from '../services/api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    if (password !== password2) {
      setErrors({ password2: ["As senhas não coincidem."] });
      return;
    }

    try {
      await api.post('/register/', {
        username,
        email,
        password,
        password2,
      });

      alert('Registro realizado com sucesso! Faça o login.');

    } catch (err: any) {
      console.error('Falha no registro:', err.response.data);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: ['Ocorreu um erro de conexão. Tente novamente.'] });
      }
    }
  };

  return (
    <div>
      <h1>Criar Nova Conta</h1>
      <form onSubmit={handleSubmit}>

        {errors.general && <p style={{ color: 'red' }}>{errors.general.join(', ')}</p>}
        {errors.non_field_errors && <p style={{ color: 'red' }}>{errors.non_field_errors.join(', ')}</p>}
        
        <div>
          <label>Nome de Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && errors.username.map((error, i) => (
            <p key={i} style={{ color: 'red', margin: 0 }}>{error}</p>
          ))}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && errors.email.map((error, i) => (
            <p key={i} style={{ color: 'red', margin: 0 }}>{error}</p>
          ))}
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && errors.password.map((error, i) => (
            <p key={i} style={{ color: 'red', margin: 0 }}>{error}</p>
          ))}
        </div>

        <div>
          <label>Confirmar Senha:</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          {errors.password2 && errors.password2.map((error, i) => (
            <p key={i} style={{ color: 'red', margin: 0 }}>{error}</p>
          ))}
        </div>
        
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;