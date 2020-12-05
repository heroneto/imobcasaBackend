## Documentação

#### Distribuição de Leads

1. Recebe o Lead via HTTP POST do automate.io
2. Verifica o formulário que este Lead faz parte
3. Verifica os usuários que este formulário está atrelado
4. Verifica qual usuário é prioridade
    - Caso tenham dois ou mais do mesmo nível verifica qual foi o ultimo que recebeu e encaminha para o outro
    - Existe uma verificação de usuário estar Online ou não pelo App, talvez um status.
    - Possibilidade tmb de organizar a prioridade por dias.
5 - Relaciona o Lead ao usuário.

#### Organização de Leads no Facebook
- Os Leads são organizados por Formulários, onde os usuários são relacionados aos formulários


#### Cadastro de formulários na plataform
1. Haverá uma tela de cadastro de forms
2. Ao preencher as regras de distribuição, será possível cadastrar um form pelo ID do form do facebook, ou selecionar de um que já foi cadastrado anteriormente.

#### Cadatro de usuários
1. Terá uma tela de cadastro de usuários.
2. Campos de cadastro
    - Nome Completo
    - Username
    - Email
    - Whatsapp
    - Gerente: Boolean
    - Visível em relatórios: Boolean
    - Pode receber Leads: Boolean
    - Código da loja: Input text
    - Assinatura(Email): Text Field
    - Receber cópia de resposta ao Lead por Email: Boolean
    - Configurações avançadas:
      - Participa do rodízio de leads do tipo: Checkbox
        - COMPRA
        - ALUGUEL
        - INDEFINIDO
        - LANÇAMENTO
        - CAPTAÇÃO
      - Recebe leads de captações próprias do tipo:
        - Compra
        - Aluguel
        - Indefinido
        - Lançamento
3. Haverá um botão para desativar o usuário




login steps
1 - acessa /login
2 - React coleta dados e envia para backend que retorna token de acesso.
3 - Todas próximas requisições que tiverem o token serão passadas para o backend.
