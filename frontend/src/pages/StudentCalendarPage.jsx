// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import api from "../services/api";
import Calendar from "react-calendar";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify"; // Importando Toast
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.css"; // Estilos do Toast
import "./calendarStyles.css"; // Arquivo de estilos CSS personalizado
import Header from "../components/Header";

const StudentCalendarPage = () => {
  const [aulaFixa, setAulaFixa] = useState(null);
  // const [motivo, setMotivo] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const alunoId = localStorage.getItem("userId");

  const fetchAulaFixa = async () => {
    const response = await api.get(`/aula-fixa/aluno-logado/${alunoId}`);
    const sortedAulas = response.data.sort((a, b) => {
      return new Date(a.horario) - new Date(b.horario);
    });
    setAulaFixa(sortedAulas);
  };

  useEffect(() => {
    fetchAulaFixa();
    setInfoModalIsOpen(true); // Abre o modal informativo ao carregar a página
  }, [alunoId]);

  const openModal = async () => {
    setModalIsOpen(true);
    await fetchAvailableSlots(selectedDate);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeInfoModal = () => {
    setInfoModalIsOpen(false); // Fecha o modal informativo
  };

  // Nova função para fechar o modal da Débora e abrir o do calendário
  const handleRemarcarClick = () => {
    closeInfoModal(); // Fecha o modal da professora Débora
    openModal(); // Abre o modal do calendário
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await api.get(`/horarios-disponiveis?data=${date.toISOString()}`);
      const sortedSlots = response.data.sort((a, b) => {
        return new Date(a.horario) - new Date(b.horario); // Ordem crescente
      });
      setAvailableSlots(sortedSlots);
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAvailableSlots(date);
  };

  const handleRemarcar = async (horario) => {
    try {
      const response = await api.post("/remarcar", {
        alunoId,
        novaAulaId: horario.id,
        antigaAulaId: aulaFixa[0].id,
        // motivo,
      });

      toast.success(response.data.message);
      closeModal();
      await fetchAulaFixa(); 
    } catch (error) {
      toast.error("Erro ao remarcar a aula.");
      console.error("Erro:", error);
    }
  };

  const formatDateAndTime = (date) => {
    return (
      new Date(new Date(date).getTime() + 3 * 60 * 60 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) + " horas"
    );
  };

  const formatDateAndTimeAndDay = (date) => {
    const localDate = new Date(new Date(date).getTime() + 3 * 60 * 60 * 1000);

    const formattedDate = localDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = localDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} às ${formattedTime} horas`;
  };

  console.log("aulaFixa", aulaFixa);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow p-6 pt-0 bg-background flex flex-col items-center w-full">
        <h2 className="text-4xl font-extrabold text-secondary mb-6 mt-16">
          Meu Calendário
        </h2>
        {aulaFixa ? (
          <div className="space-y-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-secondary mb-2">
              Próximas Aulas:
            </h3>

            <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 max-h-[400px] overflow-y-auto">
              {aulaFixa.slice(0, showAllClasses ? aulaFixa.length : 4).map((aula, index) => (
                <div key={aula.id} className="mb-3 border-b border-gray-300 pb-2">
                  <p className="text-lg">
                    <span className="font-bold">Aula {index + 1}:</span>{" "}
                    {formatDateAndTimeAndDay(aula.dia)}
                  </p>
                </div>
              ))}
              <button
                onClick={() => setShowAllClasses(!showAllClasses)}
                className="mt-4 bg-blue-400 hover:underline flex items-center text-white"
              >
                {showAllClasses ? "Mostrar Menos" : "Mostrar Mais"}
                <svg xmlns="http://www.w3.org/2000/svg" className={`ml-2 h-4 w-4 transform ${showAllClasses ? "rotate-180" : "rotate-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Atualizado para chamar a nova função handleRemarcarClick */}
            <button
              onClick={handleRemarcarClick}
              className="text-lg bg-blue-400 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Remarcar próxima Aula
            </button>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              ariaHideApp={false}
              className="modal"
              overlayClassName="modal-overlay"
              style={{
                content: {
                  maxWidth: "90%",
                  width: "90%",
                  height: "80%",
                  padding: "0",
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f8f9fa",
                  margin: "auto",
                  marginLeft: "10%",
                },
              }}
            >
              <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
                <h2 className="text-lg font-bold mb-4">
                  Escolha uma nova data
                </h2>
                <Calendar onChange={handleDateChange} value={selectedDate} />
              </div>
              <div style={{ width: "50%", padding: "20px", overflowY: "auto" }}>
                <h3 className="mb-5 text-lg font-bold">
                  Horários Disponíveis:
                </h3>
                <ul className="ml-5">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <li key={slot.id} className="mb-2">
                        <button
                          onClick={() => handleRemarcar(slot)}
                          className="w-full text-sm bg-blue-400 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                        >
                          {formatDateAndTime(slot.horario)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-red-600">
                      Nenhum horário disponível para esta data.
                    </li>
                  )}
                </ul>
              </div>
            </Modal>
          </div>
        ) : (
          <p>Carregando aulas fixas...</p>
        )}
      </div>
      <Modal
        isOpen={infoModalIsOpen}
        onRequestClose={closeInfoModal}
        ariaHideApp={false}
        className="modal"
        overlayClassName="modal-overlay"
        style={{
          content: {
            maxWidth: "600px",
            width: "90%",
            height: "auto",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "10px",
            margin: "auto",
            textAlign: "center",
          },
        }}
      >
        <h2 className="text-xl font-bold mt-1"><strong>Professora Debora</strong></h2>
        <img
          src="/img_piscina.jpg"
          alt="Professora Débora"
          className="w-40 h-auto mb-4 mx-auto block"
        />
        <p className="text-gray-700 mb-2">
          Debora Recla <br />
          💦 | Personal de natação Infantil e Adulto | Funcional Kids <br />
          📍 | Serra/ES | Atendimento em Domicílio <br />
          ✨ | Experiência com crianças atípicas <br />
          <br />
          Aulas particulares para todas as idades, do bebê ao adulto! Agende uma
          aula experimental!
        </p>
        <button
          onClick={closeInfoModal}
          className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Fechar
        </button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default StudentCalendarPage;

