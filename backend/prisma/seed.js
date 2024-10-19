// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Verificar se o usuário "Débora" já existe
  const existingTeacher = await prisma.user.findUnique({
    where: { email: 'debora@email.com' },
  });

  // Criar a professora Débora se ela ainda não existe
  if (!existingTeacher) {
    await prisma.user.create({
      data: {
        nome: 'Débora',
        email: 'debora@email.com',
        senha: '1234',
        role: 'professora', // ou o papel que você definiu
      },
    });
    console.log("Usuário Débora criado com sucesso.");
  } else {
    console.log("Usuário Débora já existe.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
