// src/pages/LoginPage.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from "react-toastify"; // Importando Toast

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/login', { email, senha }).then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.removeItem('userId');
        localStorage.setItem('userId', response.data.aluno.id);
        localStorage.setItem('user', JSON.stringify(response.data.aluno));


        if (response.data.aluno.role === "professora") {
          window.location.href = '/professor/calendario';
        } else {
          window.location.href = '/aluno/calendario';
        }
        toast.error("Usuario ou senha invalidos")

      }).catch((error) => {
        toast.error("Usuario ou senha invalidos")
        console.log("error --->", error);
      });
    } catch (error) {
      console.log("error ->", error);
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background">
      <div className="flex flex-col items-center w-full max-w-md p-8 space-y-4 bg-white rounded shadow-2xl">
        {/* Imagem do perfil centralizada acima do formulário */}
        <div className="flex-shrink-0 mb-4">
          <img
            src="/img_debora.jpg"
            alt="Profile"
            className="h-36 w-36 object-cover rounded-xl" // Adicionando rounded-full para fazer a imagem ser redonda
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-secondary">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-100 border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-100 border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button type="submit" className="w-full py-2 text-white bg-primary rounded hover:bg-opacity-90">
            Entrar
          </button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-sm text-center text-secondary">
          Não tem conta? <a href="/register" className="text-accent hover:underline">Cadastre-se</a>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
  
};

export default LoginPage;
