import { useState, useEffect } from "react";
import api from "../services/api";
import Calendar from "react-calendar";
import { ToastContainer } from "react-toastify";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";

const TeacherCalendarPage = () => {
  const [aulas, setAulas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllAulas, setShowAllAulas] = useState(false);

  useEffect(() => {
    const fetchAulas = async () => {
      const response = await api.get("aulas-indisponiveis/professor/1");
      setAulas(response.data);
    };
    fetchAulas();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Função para formatar a data completa com dia, horário e aluno
  const formatFullDateAndTime = (date) => {
    const adjustedDate = new Date(new Date(date).getTime() + 3 * 60 * 60 * 1000);
    const formattedDate = adjustedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = adjustedDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `dia ${formattedDate} às ${formattedTime} horas`;
  };

  const filteredAulas = aulas.filter((aula) => {
    const aulaDate = new Date(aula.dia);
    return aulaDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow p-6 pt-0 bg-background flex">
        {/* Definindo largura fixa para o calendário */}
        <div className="w-[400px]"> {/* Ajuste a largura conforme necessário */}
          <h2 className="text-4xl font-extrabold text-secondary mb-6 mt-16">
            Calendário
          </h2>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>

        {/* Definindo largura fixa para a área de aulas */}
        <div className="w-[600px] p-2 ml-6 flex flex-col"> {/* Ajuste a largura conforme necessário */}
          <div className="flex justify-between items-center mb-6 mt-14">
            <h2 className="text-4xl font-extrabold text-secondary">
              Aulas Marcadas
            </h2>
            <button
              onClick={() => setShowAllAulas((prev) => !prev)}
              className="text-blue-500 underline"
            >
              {showAllAulas ? "Aulas por Data" : "Todas as Aulas"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 h-[400px] overflow-y-auto">
            {showAllAulas ? (
              aulas.length > 0 ? (
                aulas.map((aula) => (
                  <div
                    key={aula.id}
                    className="mb-3 border-b border-gray-300 pb-2"
                  >
                    <p className="text-lg">
                      <span className="font-bold">Aula </span>
                      {formatFullDateAndTime(aula.dia)} - {aula.nomeAluno}
                    </p>
                    {aula.motivo && (
                      <p className="text-sm text-gray-500">
                        Motivo: {aula.motivo}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-secondary">
                  Nenhuma aula indisponível encontrada.
                </p>
              )
            ) : (
              filteredAulas.length > 0 ? (
                filteredAulas.map((aula, index) => (
                  <div
                    key={aula.id}
                    className="mb-3 border-b border-gray-300 pb-2"
                  >
                    <p className="text-lg">
                      <span className="font-bold">Aula {index + 1}:</span>{" "}
                      {formatFullDateAndTime(aula.dia)} - {aula.nomeAluno}
                    </p>
                    {aula.motivo && (
                      <p className="text-sm text-gray-500">
                        Motivo: {aula.motivo}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-secondary">
                  Nenhuma aula marcada para esta data.
                </p>
              )
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TeacherCalendarPage;
