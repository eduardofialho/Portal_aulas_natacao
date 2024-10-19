// server.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { startOfDay, endOfDay } = require("date-fns");

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Permite apenas o frontend neste endereço
    methods: ["GET", "POST", "PUT"], // Métodos permitidos
    credentials: true, // Permite cookies, se necessário
  })
);

app.use(express.json());

app.post("/register", async (req, res) => {
  const { nome, email, dataNascimento, senha, diaSemana, horario, role } =
    req.body;
  const hashedSenha = await bcrypt.hash(senha, 10);

  try {
    // Se for um professor, apenas cria o registro com os dados básicos
    if (role === "professor") {
      const professor = await prisma.usuario.create({
        data: {
          nome,
          email,
          dataNascimento: new Date(dataNascimento),
          senha: hashedSenha,
          role,
        },
      });

      return res.status(201).json({
        message: "Cadastro de professor realizado com sucesso!",
        professor,
      });
    } else {
      // Caso contrário, segue com o cadastro de um aluno e com o agendamento
      const aluno = await prisma.usuario.create({
        data: {
          nome,
          email,
          dataNascimento: new Date(dataNascimento),
          senha: hashedSenha,
          role: "aluno", // Força o role para "aluno" nesse caso
        },
      });

      // Formatação e cálculo de horários para aulas
      const [hours, minutes] = horario.split(":");
      const fixedTime = new Date(
        Date.UTC(1970, 0, 1, parseInt(hours), parseInt(minutes), 0)
      ).getTime();

      const today = new Date();
      const finalDate = new Date(2025, 0, 31);

      const getNextDateForWeekday = (baseDate, dayOfWeek) => {
        const date = new Date(baseDate);
        const diff = (dayOfWeek - date.getDay() + 7) % 7;
        date.setDate(date.getDate() + diff);
        return date;
      };

      const aulasParaAtualizar = [];
      let nextDate = getNextDateForWeekday(today, diaSemana);

      while (nextDate <= finalDate) {
        const aulaDia = new Date(nextDate);
        aulaDia.setHours(hours - 3, minutes, 0, 0);

        aulasParaAtualizar.push({
          dia: aulaDia,
          horario: aulaDia,
        });

        nextDate.setDate(nextDate.getDate() + 7);
      }

      for (const { dia, horario } of aulasParaAtualizar) {
        const aulaEncontrada = await prisma.aula.findFirst({
          where: {
            dia: dia,
            horario: horario,
            disponivel: true,
          },
        });

        if (aulaEncontrada) {
          if (aulaEncontrada.alunoId === null) {
            await prisma.aula.update({
              where: { id: aulaEncontrada.id },
              data: {
                alunoId: aluno.id,
                disponivel: false,
              },
            });
          } else {
            console.log(`Aula ${aulaEncontrada.id} já está ocupada.`);
          }
        }
      }

      res.status(201).json({
        message: "Cadastro e agendamento de aluno realizados com sucesso!",
        aluno,
      });
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const aluno = await prisma.usuario.findUnique({ where: { email } });

  if (aluno && (await bcrypt.compare(senha, aluno.senha))) {
    const token = jwt.sign({ alunoId: aluno.id }, "secreto", {
      expiresIn: "1h",
    });
    res.json({ token, aluno });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

app.post("/remarcar", async (req, res) => {
  const { alunoId, novaAulaId, antigaAulaId, motivo } = req.body;

  const idNumber = Number(alunoId);

  try {
    // Encontrar a aula original
    const aulaOriginal = await prisma.aula.findUnique({
      where: { id: novaAulaId },
    });

    if (!aulaOriginal) {
      return res.status(404).json({ error: "Aula original não encontrada." });
    }

    // Marcar a aula original como indisponível
    await prisma.aula.update({
      where: { id: novaAulaId },
      data: { disponivel: false },
    });

    // Marcar a aula antiga como disponivel
    await prisma.aula.update({
      where: { id: antigaAulaId },
      data: { disponivel: true, alunoId: null },
    });

    // Criar uma nova aula remarcada
    const novaAula = await prisma.aula.create({
      data: {
        dia: aulaOriginal.dia, // Mantenha a data da aula original
        horario: aulaOriginal.horario, // Mantenha o horário da aula original
        alunoId: idNumber,
        professorId: aulaOriginal.professorId,
        disponivel: false,
        remarcadaDeId: aulaOriginal.id, // Referência à aula original
      },
    });

    // Opcional: Se você quiser registrar o motivo da remarcação em outra tabela, você pode adicionar isso aqui.

    res.json({ novaAula, message: "Aula remarcada com sucesso." });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error: "Erro ao remarcar a aula" });
  }
});

app.get("/aula-fixa/aluno-logado/:id", async (req, res) => {
  const alunoId = Number(req.params.id);

  try {
    const aluno = await prisma.usuario.findUnique({
      where: { id: alunoId },
      include: { aulasComoAluno: true }, // Inclui o relacionamento correto
    });

    if (aluno && aluno.aulasComoAluno.length > 0) {
      res.json(aluno.aulasComoAluno); // Retorna as aulas como aluno
    } else {
      res.status(404).json({ error: "Aula fixa não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao buscar aula fixa:", error);
    res.status(500).json({ error: "Erro ao buscar aula fixa" });
  }
});

app.get("/aulas-indisponiveis/professor/:professorId", async (req, res) => {
  const professorId = Number(req.params.professorId);

  try {
    // Consulta inicial para buscar aulas indisponíveis
    const aulasIndisponiveis = await prisma.aula.findMany({
      where: {
        professorId: professorId,
        disponivel: false,
        alunoId: {
          not: null,
        },
      },
      orderBy: [
        {
          dia: 'asc',
        },
        {
          horario: 'asc',
        },
      ],
    });

    // Filtrando aulas duplicadas
    const aulasFiltradas = [];
    const diasHorariosVistos = new Set();

    for (const aula of aulasIndisponiveis) {
      const diaHorario = `${aula.dia.toISOString()}_${aula.horario.toISOString()}`;
      
      // Verifica se já existe aula para este dia e horário
      if (!diasHorariosVistos.has(diaHorario)) {
        diasHorariosVistos.add(diaHorario);
        aulasFiltradas.push(aula);
      } else if (aula.remarcadaDeId !== null) {
        // Substitui com o novo caso `remarcadaDeId` esteja preenchido
        const index = aulasFiltradas.findIndex(
          (a) => a.dia.toISOString() === aula.dia.toISOString() && a.horario.toISOString() === aula.horario.toISOString()
        );
        if (index !== -1) aulasFiltradas[index] = aula;
      }
    }

    // Para cada `alunoId` encontrado nas aulas, busque o nome correspondente na tabela Usuario
    const aulasComNomes = await Promise.all(
      aulasFiltradas.map(async (aula) => {
        if (aula.alunoId) {
          const aluno = await prisma.usuario.findUnique({
            where: { id: aula.alunoId },
            select: { nome: true },
          });
          return { ...aula, nomeAluno: aluno ? aluno.nome : null };
        }
        return { ...aula, nomeAluno: null };
      })
    );

    // Retorna o resultado com os nomes dos alunos
    if (aulasComNomes.length > 0) {
      res.json(aulasComNomes);
    } else {
      res.status(404).json({ message: "Nenhuma aula indisponível encontrada." });
    }
  } catch (error) {
    console.error("Erro ao buscar aulas não disponíveis:", error);
    res.status(500).json({ error: "Erro ao buscar aulas não disponíveis." });
  }
});



app.get("/horarios-disponiveis", async (req, res) => {
  const { data } = req.query; // Data selecionada
  const selectedDate = new Date(data);

  // Define o início e o final do dia selecionado
  const startOfSelectedDay = startOfDay(selectedDate);
  const endOfSelectedDay = endOfDay(selectedDate);

  try {
    const availableSlots = await prisma.aula.findMany({
      where: {
        dia: {
          gte: startOfSelectedDay,
          lt: endOfSelectedDay,
        },
        disponivel: true,
      },
      select: {
        id: true,
        horario: true,
      },
    });

    res.json(availableSlots);
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error);
    res.status(500).json({ error: "Erro ao buscar horários disponíveis" });
  }
});

// Função para criar aulas automaticamente
// async function createWeeklyClasses() {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const startHour = 8; // 8:00 AM
//   const endHour = 17; // 5:00 PM
//   const lunchStart = 12; // 12:00 PM
//   const lunchEnd = 13; // 1:00 PM

//   for (const day of days) {
//     for (let hour = startHour; hour < endHour; hour++) {
//       // Pula a hora do almoço
//       if (hour === lunchStart) {
//         hour = lunchEnd; // pula para 1:00 PM
//       }
//       const date = new Date();
//       date.setDate(date.getDate() + ((7 + dayIndex(day) - date.getDay()) % 7)); // Próxima ocorrência do dia

//       await prisma.aula.create({
//         data: {
//           dia: date,
//           horario: new Date(
//             date.getFullYear(),
//             date.getMonth(),
//             date.getDate(),
//             hour
//           ),
//           professorId: 1, // Supondo que o professor ID 1 já exista
//           disponivel: true,
//         },
//       });
//     }
//   }
// }

// // Função para obter o índice do dia da semana
// function dayIndex(day) {
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   return days.indexOf(day);
// }

// // Rota para criar aulas automaticamente
// app.post("/create-classes", async (req, res) => {
//   try {
//     await createWeeklyClasses();
//     res.status(200).json({ message: "Aulas criadas com sucesso!" });
//   } catch (error) {
//     console.error("Erro ao criar aulas:", error);
//     res.status(500).json({ error: "Erro ao criar aulas" });
//   }
// });

// Rota para inserir todas as aulas
app.post("/aulas_insert", async (req, res) => {
  try {
    // Definindo as datas e horários
    const startDate = new Date("2024-10-14T08:00:00Z");
    const endDate = new Date("2025-01-31T23:59:59Z");
    const horariosSemana = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    const horariosSabado = ["08:00", "09:00", "10:00", "11:00"];

    // Gerar todas as aulas
    const aulas = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      let horarios = [];
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Segunda a sexta
        horarios = horariosSemana;
      } else if (dayOfWeek === 6) {
        // Sábado
        horarios = horariosSabado;
      }

      horarios.forEach((hora) => {
        const [hours, minutes] = hora.split(":");
        const aulaDate = new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            parseInt(hours),
            parseInt(minutes)
          )
        );
        aulas.push({
          dia: aulaDate,
          horario: aulaDate,
          professorId: 1,
          disponivel: true,
        });
      });

      // Incrementa um dia
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    console.log("aulas", aulas)

    // Inserir as aulas geradas no banco de dados
    const createdAulas = await prisma.aula.createMany({
      data: aulas,
      skipDuplicates: true, // Evita duplicatas caso a rota seja chamada várias vezes
    });

    res
      .status(201)
      .json({ message: "Aulas inseridas com sucesso", createdAulas });
  } catch (error) {
    console.error("Erro ao inserir aulas:", error);
    res.status(500).json({ error: "Erro ao inserir aulas." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
