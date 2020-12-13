# Sobre o projeto
Este projeto se trata de um Backend para o App I-Mobcasa, responsável por receber os Leads da API do Facebook e armazenar em um banco de dados relacional.
O Lead deve ser relacionado à um usuário(no caso um corretor), que receberá uma notificação no App Mobile para realizar o primeiro atendimeto.

***

# Features
Abaixo as Features do projeto e seu status de implemetação, tanto da Feature quanto do teste automatizado.

## Usuários
- **[x]Feat [x]Test** Cadastro de usuários
- **[x]Feat [x]Test** Leitura de usuários
- **[x]Feat [x]Test** Edição de usuários
- **[x]Feat [x]Test** Remoção de usuários

## Autenticação
Autenticação no App para acessar.
- **[x]Feat [x]Test** Autenticação JWT de usuários(usuário e senha)
- **[x]Feat [x]Test** Validar token JWT de autenticação

## Autorização
A autorização servirá para validar se o usuário possui acesso à telas especificas de configuração do App.
- **[x]Feat [x]Test** Verifcar se usuário possui privilégios de administrador.

## Campanhas
A campanha representa um produto anunciado/conjunto de anuncios no facebook. É possível atrelar vários usuários na campanha para que recebam os Leads referentes àquela campanha.
- **[x]Feat [x]Test** Cadastro de campanha
- **[x]Feat [x]Test** Leitura de campanha
- **[x]Feat [x]Test** Listar campanhas
- **[x]Feat [x]Test** Adição de usuários da campanha
- **[x]Feat [x]Test** Remoção de usuários da campanha
- **[x]Feat [x]Test** Listar usuários da campanha
- **[x]Feat [x]Test** Inativação de campanha
- **[x]Feat [x]Test** ativação de campanha


## Lead
O Lead representa um cliente em potencial, O Lead deve ser atrelado sempre à um usuário e à uma campanha que ele entrou. O Lead pode ser cadastro manualmente ou ser recebido via API do Facebok quando ele se cadastra via um anúncio informando seus dados.
- **[x]Feat [x]Test** Cadastrar Lead para meu usuário
- **[x]Feat [x]Test** Cadastrar Lead para qualquer usuário se for admin
- **[x]Feat [x]Test** Listar de Todos Leads do usuário logado
- **[x]Feat [x]Test** Listar de Todos Leads se for um admin
- **[ ]Feat [ ]Test** Aplicar paginação no resultado dos Leads
- **[ ]Feat [ ]Test** Lista Leads de um determinado Status [Analisando]
- **[x]Feat [x]Test** Busca de Leads com base em nome ou phone
- **[x]Feat [x]Test** Edição meu Lead
- **[x]Feat [x]Test** Edição qualquer Lead se for admin
- **[x]Feat [x]Test** Remoção do meu Lead
- **[x]Feat [x]Test** Remoção de qualquer Lead se for admin
- **[ ]Feat [ ]Test** ~~ Inativação do meu Lead ~~
- **[ ]Feat [ ]Test** ~~ Inativação de qualquer Lead se for admin ~~ 
- **[ ]Feat [ ]Test** ~~Listar todos os Leads de um usuário~~
- **[ ]Feat [ ]Test** ~~Alterar Status do Lead: Envolve alteração de tarefas dependendo do status a movimentar.~~
- **[ ]Feat [ ]Test** Recebimento de Lead via Webhook API Facebook
- **[ ]Feat [ ]Test** Coleta de informações referentes ao Lead recebido via Webhook API Facebook
- **[ ]Feat [ ]Test** Distrubuição de Lead recebido via Webhook API Facebook com base em Score dos usuários da campanha: *Algoritmo será definido ainda*


## Tarefa
A tarefa é um item que fica associado ao Lead e ao usuário, representando um agendamento ou cobrança que será/deveria ser feita.
O Lead pode ter, ao longo do histórico, várias tarefas, mas apenas uma deve estar ativa, a antiga deve ser inativada para criação de uma nova tarefa. Tarefas não podem ser removidas.
- **[ ]Feat [ ]Test** Criação de nova tarefa
- **[ ]Feat [ ]Test** Leitura de tarefa atual
- **[ ]Feat [ ]Test** Listagem de tarefas de um Lead
- **[ ]Feat [ ]Test** Edição de tarefa
- **[ ]Feat [ ]Test** Remoção de tarefa
- **[ ]Feat [ ]Test** Alteração de status de tarefa.


## UsersCampaigns
Representa uma ligação de usuários com as campanhas, utilizada para avaliação do Score dos usuários com as campanhas.
- **[ ]Feat [ ]Test** Alteração de Score do usuário: *Algoritmo será definido ainda*


# Entidades
Entidades de banco de dados estão descritas no SQLDBM e no DrawIO.

<img src="" />


***
Em construção...