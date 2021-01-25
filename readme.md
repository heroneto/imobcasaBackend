# Sobre o projeto
Este projeto se trata de um Backend para o App I-Mobcasa, responsável por receber os Leads da API do Facebook e armazenar em um banco de dados relacional.
O Lead deve ser relacionado à um usuário(no caso um corretor), que receberá uma notificação no App Mobile para realizar o primeiro atendimeto.

***

# Features
Abaixo as Features do projeto e seu status de implemetação, tanto da Feature quanto do teste automatizado.

## Usuários
- **[x]Feat [x]Test** Cadastro de **usuários**
- **[x]Feat [x]Test** Leitura de usuários
- **[x]Feat [x]Test** Edição de usuários
- **[x]Feat [x]Test** Remoção de usuários

## Autenticação
Autenticação no App para acessar.
- **[x]Feat [x]Test** Retornar accessToken e refreshToken ao autenticar usuário
- **[x]Feat [x]Test** Validar token JWT de autenticação 
- **[x]Feat [x]Test** Retornar novo accessToken ao receber uma requisição de refreshToken válido. 

## Autorização
A autorização servirá para validar se o usuário possui acesso à telas especificas de configuração do App.
- **[x]Feat [x]Test** Verifcar se usuário possui privilégios de administrador.

## Forms
O formulário representa um anúncio no facebook. É possível atrelar vários usuários em um formulário para que recebam os Leads que se cadastrem através dele.
- **[x]Feat [x]Test** Cadastro de Form
- **[x]Feat [x]Test** Leitura de Form
- **[x]Feat [x]Test** Listar Forms
- **[x]Feat [x]Test** Adição de usuários da Form
- **[x]Feat [x]Test** Remoção de usuários da Form
- **[x]Feat [x]Test** Listar usuários da Form
- **[x]Feat [x]Test** Inativação de Form
- **[x]Feat [x]Test** ativação de Form


## Lead
O Lead representa um cliente em potencial, O Lead deve ser atrelado sempre à um usuário e à uma campanha que ele entrou. O Lead pode ser cadastro manualmente ou ser recebido via API do Facebok quando ele se cadastra via um anúncio informando seus dados.
- **[x]Feat [x]Test** Cadastrar Lead para meu usuário
- **[x]Feat [x]Test** Cadastrar Lead para qualquer usuário se for admin
- **[x]Feat [x]Test** Listar de Todos Leads do usuário logado
- **[x]Feat [x]Test** Listar de Todos Leads se for um admin
- **[x]Feat [x]Test** Aplicar paginação no resultado dos Leads
- **[x]Feat [x]Test** Lista Leads de um determinado Status
- **[x]Feat [x]Test** Busca de Leads com base em nome ou phone
- **[x]Feat [x]Test** Edição meu Lead
- **[x]Feat [x]Test** Edição qualquer Lead se for admin
- **[x]Feat [x]Test** Remoção do meu Lead
- **[x]Feat [x]Test** Remoção de qualquer Lead se for admin
- **[ ]Feat [ ]Test** ~~Inativação do meu Lead~~
- **[ ]Feat [ ]Test** ~~Inativação de qualquer Lead se for admin~~ 
- **[ ]Feat [ ]Test** ~~Listar todos os Leads de um usuário~~
- **[ ]Feat [ ]Test** ~~Alterar Status do Lead: Envolve alteração de tarefas dependendo do status a movimentar.~~


## FB Webhook
- **[x]Feat [x]Test** Inscrição do App
- **[x]Feat [x]Test** Distrubuição de Lead recebido via Webhook API Facebook.


## FB Webhook - Leads
- **[x]Feat [x]Test** Recebimento de Lead via Webhook API Facebook - [Documentação de Webhook do Facebook](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- **[x]Feat [x]Test** Validar X-Auth da requisição
- **[x]Feat [x]Test** Validar campos do Lead recebido.
- **[x]Feat [x]Test** Coletar Lead via ID recebido.
- **[ ]Feat [ ]Test** ~~Coleta de informações referentes do Form do Lead recebido via Webhook API Facebook~~


## FB Page Forms
- **[x]Feat [x]Test** Lista todos os formulários da página do facebook de forma paginada


## FB Access Token
- **[ ]Feat [ ]Test** ~~Criação de Token: Deve criar um Token novo caso não exista~~
- **[ ]Feat [ ]Test** ~~Atualização de Token: Deve atualizar um token existente mediante ID recebido.~~
- **[ ]Feat [ ]Test** ~~Remoção de Token: Deve poder remover o token.~~
- **[ ]Feat [ ]Test** ~~Leitura de Token: Deve ler o token cadastrado.~~
- **[ ]Feat [ ]Test** ~~checagem de Token: Deve poder checar o token passado para verificar se é válido.~~

## Tarefa
A tarefa é um item que fica associado ao Lead e ao usuário, representando um agendamento ou cobrança que será/deveria ser feita.
O Lead pode ter, ao longo do histórico, várias tarefas, mas apenas uma deve estar ativa, a antiga deve ser inativada para criação de uma nova tarefa. Tarefas não podem ser removidas.
- **[x]Feat [x]Test** Criação de nova tarefa
- **[ ]Feat [ ]Test** ~~Leitura de tarefa atual~~
- **[x]Feat [x]Test** Listagem de tarefas de um Lead
- **[x]Feat [x]Test** Edição de tarefa
- **[x]Feat [x]Test** Remoção de tarefa
- **[ ]Feat [ ]Test** ~~Alteração de status de tarefa.~~

## UsersForms
Representa uma ligação de usuários com os formulários, utilizada para avaliação do Score dos usuários com os formulários.
- **[x]Feat [x]Test** Update(enabled, lastLeadRecevedTime, score)
- **[x]Feat [x]Test** Alteração de enabled para True
- **[x]Feat [x]Test** Alteração de enabled para false

## Notificações
Necessário pensar em como notificar usuários quando um Lead for atribuído.



# Entidades
Entidades de banco de dados estão descritas no SQLDBM e no DrawIO.

<img src="" />


# ENV necessários
- PRIVATE_KEY = Chave privada para assinatura da autenticação JWT
- PUBLIC_KEY =Chave pública para verificação assinatura da autenticação JWT
- FB_SUB_TOKEN = Token usado para verificar inscrição do Webhook
- FB_APP_SECRET_KEY = APP Secret usado para requisições de dados do Lead
- FB_APP_TOKEN = Token de autenticação para requisições de dados do Lead
- FB_PAGE_TOKEN = TOKEN de autenticação para requisições da listagem de formulários
- FB_PAGE_ID = ID da página do Facebook da IMOBCASA

***
Em construção...