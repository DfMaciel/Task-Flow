# Task-Flow

<p> Task-Flow é um aplicativo de gerenciamento de tarefas desenvolvido para auxiliar na organização pessoal e na produtividade. Ele permite que os usuários criem, editem e acompanhem suas atividades diárias de forma eficiente, oferecendo recursos como autenticação segura, diferentes visualizações de tarefas (lista, calendário e quadro Kanban) e funcionalidades adicionais para facilitar o acompanhamento e a conclusão das tarefas como estatísticas sobre aproveitamento de tempo, notificações acerca de tarefas pendentes e fácil criação de tarefas recorrentes.

<h2> 📒 Product Backlog </h2><a name="productbacklog"></a>

| Id | Prioridade | Tarefas | Requisito do Cliente | Critério de Aceitação | Sprint |
| --- | --- | --- | --- | --- | --- |
| 1 | Alta | Como Usuário, eu quero criar uma conta com autenticação via e-mail e senha, para que eu possa acessar minhas tarefas com segurança. | 1 | O sistema deve permitir o cadastro e login seguro com validação de credenciais. | 1 |
| 2 | Alta | Como Usuário, eu quero adicionar tarefas com título, descrição, prazo e prioridade, para que eu possa organizar melhor minhas atividades. | 2 | O sistema deve permitir a criação e edição de tarefas com esses campos obrigatórios. | 1 |
| 4 | Alta | Como Usuário, eu quero visualizar todas as minhas tarefas em uma interface de lista para facilitar meu acompanhamento. | 5 | O sistema deve exibir as tarefas do usuário em lista.| 1 |
| 5 | Alta | Como Usuário, eu quero marcar tarefas como concluídas ou pendentes, para gerenciar melhor minhas atividades. | 6 | O sistema deve permitir a alteração do status das tarefas. | 1 |
| 6 | Alta | Como Usuário, eu quero editar ou excluir tarefas já criadas, para manter minha lista sempre atualizada. | 8 | O sistema deve permitir edição e exclusão de tarefas. | 1 |
| 7 | Alta | Como Usuário, eu quero registrar "Check-in" ao iniciar e concluir uma tarefa, para acompanhar meu progresso. | 13 | O sistema deve permitir registrar início e fim de execução das tarefas. | 1 |
| 8 | Alta | Como Usuário, eu quero adicionar notas a cada tarefa, para registrar informações adicionais. | 10 | O sistema deve permitir a adição de notas dentro das tarefas. | 1 |
| 9 | Alta | Como Usuário, eu quero definir o tempo estimado para cada tarefa. | 11 | O sistema deve permitir a definição de tempo estimado. | 1 |
| 10 | Média | Como Usuário, eu quero acompanhar o tempo gasto, para melhorar minha produtividade. | 11 | O sistema deve exibir o tempo real gasto. | 2 |
| 11 | Média | Como Usuário, eu quero organizar minhas tarefas em categorias, como "Trabalho", "Pessoal", "Estudos", para facilitar minha organização. | 3 | O sistema deve permitir que o usuário classifique suas tarefas em categorias. | 2 |
| 12 | Média | Como Usuário, eu quero definir metas e subdividir tarefas grandes em subtarefas menores, para que eu possa acompanhar melhor o progresso. | 4 | O sistema deve permitir a criação de subtarefas dentro de uma tarefa principal. | 2 |
| 13 | Média | Como Usuário, eu quero adicionar imagens a cada tarefa, para registrar informações adicionais. | 10 | O sistema deve permitir a adição de imagens dentro das tarefas. | 2 |
| 14 | Média | Como Usuário, eu quero visualizar todas as minhas tarefas em uma interface de calendário para facilitar meu acompanhamento. | 5 | O sistema deve exibir as tarefas do usuário em calendário.| 2 |
| 15 | Média | Como Usuário, eu quero filtrar tarefas por prazo, prioridade ou status, para localizar mais facilmente as informações que preciso. | 14 | O sistema deve oferecer filtros personalizados para a listagem de tarefas. | 2 |
| 16 | Média | Como Usuário, eu quero visualizar minhas tarefas em uma interface tipo "Kanban", para organizar melhor meu fluxo de trabalho. | 18 | O sistema deve oferecer uma visualização em Kanban para as tarefas. | 2 |
| 17 | Média | Como Usuário, eu quero receber notificações sobre tarefas pendentes ou prazos próximos, para que eu não perca meus compromissos. | 7 | O sistema deve enviar lembretes e notificações de tarefas pendentes. | 2 |
| 18 | Baixa | Como Usuário, eu quero criar "tarefas recorrentes", para que eu possa automatizar atividades diárias, semanais ou mensais. | 9 | O sistema deve permitir a criação de tarefas recorrentes com períodos configuráveis. | 2 |
| 19 | Baixa | Como Usuário, eu quero gerar relatórios sobre o andamento das tarefas, para analisar minha produtividade. | 12 | O sistema deve gerar relatórios com estatísticas de tarefas concluídas e pendentes. | 3 |
| 20 | Baixa | Como Usuário, eu quero compartilhar tarefas ou listas de tarefas com outros usuários, para colaborar com colegas e amigos. | 16 | O sistema deve permitir o compartilhamento de tarefas e listas. | 3 |
| 21 | Baixa | Como Usuário, eu quero criar lembretes para tarefas que exigem ações em determinados horários, para garantir que eu cumpra meus compromissos. | 17 | O sistema deve permitir a configuração de lembretes com horários específicos. | 3 |
| 22 | Baixa | Como Usuário, eu quero integrar minhas tarefas com outras ferramentas de produtividade, como calendários ou agendas. | 20 | O sistema deve permitir integração com aplicativos de calendário. | 3 |
| 23 | Baixa | Como Usuário, eu quero usar o acelerômetro do dispositivo para rastrear atividades físicas, como caminhadas e corridas. | 15 | O sistema deve coletar dados do acelerômetro para rastrear movimentos. | 3 |

<h2> 💻 Tecnologias </h2>

- React Native
- Java 17
- Spring
- PostgreSQL
- TypeScript

<h2> 🛠️ Como executar </h2>

<h3> 1º - Clone o Repositório</h3>
<pre><code>git clone https://github.com/DfMaciel/Task-Flow </code></pre>

<h3> 2º - Instale as dependências do FrontEnd </h3>

``` bash
  cd /Frontend/task-flow
  npm install

  #Crie uma variável de ambiente
  touch .env
  #Contendo o endereço do servidor Backend
  SERVER_ROUTE='rota_do_servidor:porta' 
```

<h3> 3º - Inicie a aplicação mobile </h3>
<pre><code>  npx expo start </code></pre>

<h3> 4º Instale as depenências do Backend </h3>

``` bash
  cd /Backend/  # Na raiz do projeto

  #Crie uma variável de ambiente
  touch .env

  #Contendo os seguintes campos:

  DATABASE_URL=jdbc:postgresql://endereço:porta/nome #String conexão do banco de dados
  DATABASE_USERNAME=nome_do_usuario
  DATABASE_PASSWORD=senha_do_banco
  JWT_SECRET=palavra_secreta #Precisar conter no mínimo 256 bits
  JWT_EXPIRATION=tempo_em_ms #Tempo de expiração do token primário
  JWT_REFRESH_EXPIRATION=tempo_em_ms #Tempo de expiração do token recuperador

  cd /task-flow

  mvn clean install
```
<h3> 5º Inicie a aplicação do Backend </h3>
<pre><code>  mvn spring-boot:run </code></pre>







