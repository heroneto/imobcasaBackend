# Sobre o projeto
Este projeto se trata de um Backend para o App I-Mobcasa, responsável por receber os Leads da API do Facebook e armazenar em um banco de dados relacional.
O Lead deve ser relacionado à um usuário(no caso um corretor), que receberá uma notificação no App Mobile para realizar o primeiro atendimeto.

***

# Features
Abaixo as Features do projeto e seu status de implemetação, tanto da Feature quanto do teste automatizado.

## Usuários
**[x]Feat [x]Test** Cadastro de usuários
**[x]Feat [x]Test** Leitura de usuários
**[x]Feat [x]Test** Edição de usuários
**[x]Feat [x]Test** Remoção de usuários

## Autenticação
Autenticação no App para acessar.
**[x]Feat [x]Test** Autenticação JWT de usuários(usuário e senha)
**[x]Feat [x]Test** Validar token JWT de autenticação

## Autorização
A autorização servirá para validar se o usuário possui acesso à telas especificas de configuração do App.
**[x]Feat [s]Test** Verifcar se usuário possui privilégios de administrador.

## Campanhas
A campanha representa um produto anunciado/conjunto de anuncios no facebook. É possível atrelar vários usuários na campanha para que recebam os Leads referentes àquela campanha.
**[ ]Feat [ ]Test** Cadastro de campanha
**[ ]Feat [ ]Test** Leitura de campanha
**[ ]Feat [ ]Test** Listar campanhas
**[ ]Feat [ ]Test** Adição de usuários da campanha
**[ ]Feat [ ]Test** Remoção de usuários da campanha
**[ ]Feat [ ]Test** Inativação de campanha
**[ ]Feat [ ]Test** ativação de campanha


## Lead
O Lead representa um cliente em potencial, O Lead deve ser atrelado sempre à um usuário e à uma campanha que ele entrou. O Lead pode ser cadastro manualmente ou ser recebido via API do Facebok quando ele se cadastra via um anúncio informando seus dados.
**[ ]Feat [ ]Test** Cadastro de Leads
**[ ]Feat [ ]Test** Leitura de Lead
**[ ]Feat [ ]Test** Listar de Todos Leads
**[ ]Feat [ ]Test** Listar todos os meus Leads
**[ ]Feat [ ]Test** Edição de Lead
**[ ]Feat [ ]Test** Alterar Status do Lead: Envolve alteração de tarefas dependendo do status a movimentar.
**[ ]Feat [ ]Test** Remoção de Lead
**[ ]Feat [ ]Test** Recebimento de Lead via Webhook API Facebook
**[ ]Feat [ ]Test** Coleta de informações referentes ao Lead recebido via Webhook API Facebook
**[ ]Feat [ ]Test** Distrubuição de Lead recebido via Webhook API Facebook com base em Score dos usuários da campanha: *Algoritmo será definido ainda*

## Tarefa
A tarefa é um item que fica associado ao Lead e ao usuário, representando um agendamento ou cobrança que será/deveria ser feita.
O Lead pode ter, ao longo do histórico, várias tarefas, mas apenas uma deve estar ativa, a antiga deve ser inativada para criação de uma nova tarefa. Tarefas não podem ser removidas.
**[ ]Feat [ ]Test** Criação de nova tarefa
**[ ]Feat [ ]Test** Alteração de status de tarefa.


## UsersCampaigns
Representa uma ligação de usuários com as campanhas, utilizada para avaliação do Score dos usuários com as campanhas.
**[ ]Feat [ ]Test** Alteração de Score do usuário: *Algoritmo será definido ainda*


# Entidades
Entidades de banco de dados estão descritas no SQLDBM e no DrawIO.

<img src="" />


***
Em construção...