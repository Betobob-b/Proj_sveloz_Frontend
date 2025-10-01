import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios, { AxiosError } from 'axios';
import type { LoginErrorResponse } from '../types/entities';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

    try {
        const response = await api.post('/auth/login/', {
            username,
            password,
        });

        const { access, refresh } = response.data;

        login(access, refresh);

        alert('Login bem-sucedido!');
        navigate('/');

    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const axiosErr = err as AxiosError<LoginErrorResponse>;
            const data = axiosErr.response?.data;

            const errorMessage =
            data?.non_field_errors?.[0] ||
            data?.detail ||
            'Nome de usuário ou senha inválidos.';

            setError(errorMessage);
        } else {
            setError('Ocorreu um erro de conexão.');
        }
        console.error('Falha no login:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}

        <div>
          <label>Nome de Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

export default Login;
