<h1>🏊 Portal de Aulas de Natação 📅</h1>

<h2>Sobre o Projeto</h2>
<p>
Este projeto foi desenvolvido por <strong>Igor Rodrigues</strong> utilizando a metodologia ágil <strong>Kanban</strong> para gerenciar tarefas e melhorar a eficiência do desenvolvimento. O <strong>Portal de Aulas de Natação</strong> foi idealizado para atender à professora <strong>Débora</strong>, que oferece aulas de natação, permitindo que alunos possam se cadastrar, agendar e reorganizar suas aulas conforme necessário. O sistema conta com um painel de controle exclusivo para a professora, onde ela pode monitorar os horários de cada aula.
</p>

<h3>Tecnologias Utilizadas</h3>
<ul>
  <li><strong>Frontend:</strong> React</li>
  <li><strong>Backend:</strong> Node.js com Express</li>
  <li><strong>Banco de Dados:</strong> MySQL, gerenciado pela ORM Prisma</li>
  <li><strong>Linguagem Principal:</strong> JavaScript</li>
</ul>

<hr />

<h2>📋 Funcionalidades</h2>
<ul>
  <li><strong>Cadastro de Alunos:</strong> os alunos podem se registrar no sistema.</li>
  <li><strong>Agendamento de Aulas:</strong> os alunos conseguem marcar e até remarcar aulas, respeitando as condições configuradas.</li>
  <li><strong>Controle de Aulas pela Professora:</strong> Débora, a professora, tem acesso a um painel onde visualiza, e controla os horários de suas aulas.</li>
  <li><strong>Sistema de Login:</strong> permite que alunos e professora acessem suas contas de forma segura.</li>
</ul>

<hr />

<h2>📂 Estrutura do Projeto</h2>

<table>
  <tr>
    <th>Stack</th>
    <th>Descrição</th>
  </tr>
  <tr>
    <td><strong>API Rest</strong></td>
    <td>Comunicação entre frontend e backend</td>
  </tr>
  <tr>
    <td><strong>React</strong></td>
    <td>Interface de usuário e funcionalidades interativas</td>
  </tr>
  <tr>
    <td><strong>Node.js</strong></td>
    <td>Backend da aplicação e lógica de negócio</td>
  </tr>
  <tr>
    <td><strong>MySQL + Prisma</strong></td>
    <td>Banco de dados relacional com gerenciamento ORM</td>
  </tr>
  <tr>
    <td><strong>Express</strong></td>
    <td>Framework para rotas e controle de middleware</td>
  </tr>
</table>

<hr />

<h2>🛠️ Instalação e Execução Local</h2>
<ol>
  <li>Clone o repositório:
    <pre><code>git clone https://github.com/Portal_aulas_natacao.git</code></pre>
  </li>
  <li>Certifique-se de que o Node.js está instalado em sua máquina (versão 16 ou superior):
    <pre><code>node -v</code></pre>
  </li>
  <li>Se estiver em uma versão anterior à 16, altere para a versão 16 com o comando:
    <pre><code>nvm use 16</code></pre>
  </li>
  <li>Instale as dependências na raiz do projeto:
    <pre><code>npm install</code></pre>
  </li>
  <li>Configure o banco de dados:
    <ul>
      <li>Crie um banco de dados MySQL conforme as configurações do arquivo <code>.env</code>.</li>
      <li>Execute as migrações para estruturar o banco:
        <pre><code>npx prisma migrate dev</code></pre>
      </li>
    </ul>
  </li>
  <li>Execute o <em>seed</em> para criar o usuário da professora Débora automaticamente no banco de dados:
    <pre><code>npx prisma db seed</code></pre>
  </li>
  <li>Inicie o back-end:
    <pre><code>npm run ndm</code></pre>
  </li>
  <li>Abra uma nova aba no terminal e inicie o front-end:
    <pre><code>npm run dev</code></pre>
  </li>
  <li>Acesse a aplicação pelo navegador no endereço:
    <pre><code>http://localhost:3000</code> (ou na porta indicada pelo Vite)</pre>
  </li>
</ol>

<hr />

<h2>📚 Fontes de Consulta</h2>
<ul>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a></li>
  <li><a href="https://nodejs.org/en/docs">Node.js</a></li>
  <li><a href="https://reactjs.org/docs/getting-started.html">React</a></li>
  <li><a href="https://www.prisma.io/docs/">Prisma ORM</a></li>
</ul>

<hr />

<h2>📜 Direitos Autorais</h2>
<p>
Este projeto foi desenvolvido por <strong>Igor Rodrigues</strong> exclusivamente para atender às necessidades da professora Débora e de seus alunos de natação. O repositório está disponível para consulta e aprendizado, mas a distribuição ou clonagem para fins comerciais não é permitida. Este repositório inclui dependências e bibliotecas de terceiros que possuem suas próprias licenças.
</p>

---

<p><strong>🚀 Aproveite o Portal de Aulas de Natação!</strong></p>
