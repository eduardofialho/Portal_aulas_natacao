// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate para redirecionar
import api from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate(); // Inicialize useNavigate
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [horario, setHorario] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        nome,
        email,
        dataNascimento,
        senha,
        diaSemana,
        horario,
      });
      alert("Cadastro realizado com sucesso!");

      const loginResponse = await api.post("/login", { email, senha });
      const { token } = loginResponse.data;

      localStorage.setItem("token", token);

      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro ou login:", error);
      alert("Erro ao realizar o cadastro ou login. Tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="w-full p-8" style={{ maxWidth: "100%", width: "90vw" }}>
        {" "}
        {/* Definindo largura com estilo inline */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-secondary text-center">
            Cadastro
          </h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label>Data de Nascimento:</label>
              <input
                type="date"
                placeholder="Data de Nascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Escolha o dia da semanal da sua aula:
              </label>
              <select
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecione um dia</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
              </select>
            </div>

            {diaSemana === "6" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Escolha o horário:
                </label>
                <select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  required
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Selecione um horário</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Escolha o horário:
                </label>
                <select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  required
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Selecione um horário</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
