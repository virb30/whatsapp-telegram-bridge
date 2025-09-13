# Especificação Técnica: Ponte WhatsApp-Telegram

## Resumo Executivo

Esta especificação técnica detalha a arquitetura e o design para a aplicação de ponte entre WhatsApp e Telegram. A solução será uma aplicação Node.js que se conectará ao WhatsApp utilizando a biblioteca `whatsapp-web.js` e ao Telegram através da API de Bot do Telegram. A aplicação irá monitorar mensagens em grupos específicos do WhatsApp e encaminhá-las para grupos correspondentes no Telegram, com base em um mapeamento definido em um arquivo de configuração. A principal motivação é automatizar a disseminação de informações entre as duas plataformas, eliminando a necessidade de encaminhamento manual.

## Arquitetura do Sistema

### Visão Geral dos Componentes

A arquitetura será composta por três componentes principais:

-   **Cliente WhatsApp (`WhatsappClient`)**: Responsável por se conectar ao WhatsApp, gerenciar a sessão (incluindo autenticação via QR code), e escutar por novas mensagens nos grupos configurados.
-   **Cliente Telegram (`TelegramClient`)**: Responsável por se conectar à API de Bot do Telegram e enviar mensagens para os grupos de destino.
-   **Encaminhador de Mensagens (`MessageForwarder`)**: O componente central que orquestra o fluxo de mensagens. Ele recebe mensagens do `WhatsappClient`, consulta o mapeamento de grupos e utiliza o `TelegramClient` para encaminhar as mensagens.

O fluxo de dados será o seguinte:
1.  O `WhatsappClient` detecta uma nova mensagem de um usuário `fromMe` em um grupo monitorado.
2.  A mensagem é passada para o `MessageForwarder`.
3.  O `MessageForwarder` identifica o grupo de destino no Telegram com base no arquivo de configuração.
4.  O `MessageForwarder` instrui o `TelegramClient` a enviar a mensagem para o grupo de destino no Telegram.

### Execução Contínua

A aplicação será projetada para operar de forma contínua como um serviço de background. Após a configuração inicial e autenticação, nenhuma interação do usuário será necessária. Para ambientes de produção, é recomendado o uso de um gerenciador de processos como o PM2, que garante que a aplicação permaneça em execução e seja reiniciada automaticamente em caso de falhas.

## Design de Implementação

### Interfaces Principais

As interfaces serão definidas em TypeScript para garantir a clareza e a manutenibilidade do código.

```typescript
// Interface para o cliente de mensagens
interface MessagingClient {
  initialize(): Promise<void>;
  onMessage(callback: (message: Message) => void): void;
}

// Interface para o encaminhador de mensagens
interface MessageForwarder {
  forward(message: Message): Promise<void>;
}

// Estrutura da mensagem
interface Message {
  from: string; // ID do grupo de origem
  text?: string;
  imageUrl?: string;
  link?: string;
}
```

### Modelos de Dados

O principal modelo de dados será a configuração de mapeamento de grupos, que será definida em um arquivo `config.json`.

```json
{
  "groupMapping": [
    {
      "whatsappGroupId": "whatsapp_group_id_1",
      "telegramGroupId": "telegram_group_id_1"
    },
    {
      "whatsappGroupId": "whatsapp_group_id_2",
      "telegramGroupId": "telegram_group_id_2"
    }
  ]
}
```

### Endpoints de API

Para o MVP, a aplicação não exporá nenhum endpoint de API. A interação do usuário será limitada à configuração inicial e à autenticação via console.

## Pontos de Integração

-   **WhatsApp**: A integração será feita através da biblioteca `whatsapp-web.js`, que simula um cliente WhatsApp Web. A autenticação será realizada via QR code.
-   **Telegram**: A integração será feita através da API de Bot do Telegram, utilizando a biblioteca `telegraf` e um token de bot para autenticação.

## Análise de Impacto

Esta é uma nova aplicação, portanto não há impacto em componentes ou serviços existentes.

## Abordagem de Testes

### Testes Unitários

-   Testes unitários serão criados para o `MessageForwarder`, utilizando mocks para o `WhatsappClient` e o `TelegramClient`.
-   Os cenários de teste incluirão o encaminhamento de diferentes tipos de mensagens (texto, imagem, link) e o tratamento de erros.

### Testes de Integração

-   Testes de integração serão desenvolvidos para verificar a conexão com o WhatsApp e o Telegram em um ambiente de teste.
-   Estes testes enviarão uma mensagem real para um grupo de teste do WhatsApp e verificarão se ela é recebida no grupo de teste do Telegram.

## Sequenciamento de Desenvolvimento

1.  **Implementação do `TelegramClient`**: Criar o módulo para enviar mensagens para o Telegram.
2.  **Implementação do `WhatsappClient`**: Criar o módulo para se conectar ao WhatsApp e escutar por mensagens.
3.  **Implementação do `MessageForwarder`**: Desenvolver a lógica para encaminhar as mensagens.
4.  **Criação do `config.json`**: Definir a estrutura do arquivo de configuração e a lógica para lê-lo.
5.  **Integração e Testes E2E**: Conectar todos os componentes e realizar testes de ponta a ponta.

## Monitoramento e Observabilidade

-   **Logging**: A biblioteca `pino` será utilizada para logging estruturado. Logs detalhados serão gerados para o fluxo de encaminhamento de mensagens e para erros.
-   **Métricas**: Métricas básicas, como o número de mensagens encaminhadas e o número de erros, serão expostas via logs para monitoramento.

## Considerações Técnicas

### Decisões Principais

-   **Uso do `whatsapp-web.js`**: A escolha desta biblioteca não oficial é uma decisão chave, pois permite a conexão com o WhatsApp sem a necessidade de uma API oficial. Esta abordagem é adequada para o escopo do projeto, mas introduz riscos.
-   **Uso do `telegraf`**: Para a integração com o Telegram, a biblioteca `telegraf` será utilizada. Ela foi escolhida por ser uma biblioteca moderna, com bom suporte a TypeScript e uma comunidade ativa.

### Riscos Conhecidos

-   **Instabilidade da API do WhatsApp**: A `whatsapp-web.js` pode se tornar instável ou ser descontinuada se o WhatsApp alterar seu funcionamento interno.
-   **Bloqueio pelo WhatsApp ou Telegram**: Existe o risco de a aplicação ser bloqueada por violar os termos de serviço. Para mitigar isso, a aplicação deve simular um comportamento humano (por exemplo, adicionando delays).

### Requisitos Especiais

-   **Baixa Latência**: A aplicação deve encaminhar as mensagens com a menor latência possível.
-   **Segurança**: As chaves de API e outras informações sensíveis devem ser gerenciadas de forma segura, utilizando variáveis de ambiente.

### Conformidade com Padrões

O projeto seguirá os padrões de código, arquitetura e revisão definidos nos documentos do projeto. As diretrizes principais estão resumidas abaixo.

#### Arquitetura

A arquitetura da aplicação seguirá os princípios da **Clean Architecture** e do **Domain-Driven Design (DDD)**, organizada nas seguintes camadas:

-   **`domain`**: Contém as regras de negócio centrais, incluindo Entidades, Agregados e Value Objects. Esta camada é completamente independente de frameworks e implementações externas.
-   **`application`**: Orquestra os fluxos de dados e as regras da aplicação através de Use Cases e Interfaces. A comunicação com esta camada deve ocorrer através de DTOs (Data Transfer Objects), sem expor o domínio.
-   **`infrastructure`**: Responsável pela interação com o mundo externo, como bancos de dados, clientes HTTP e outras APIs. Implementa as interfaces (repositórios, adaptadores) definidas na camada de aplicação.

As dependências de implementações de terceiros serão gerenciadas através do padrão **Adapter** para proteger a aplicação de mudanças externas.

#### Padrões de Codificação

-   **Idioma**: Todo o código-fonte (variáveis, métodos, classes) deve ser escrito em **inglês**.
-   **Convenções de Nomenclatura**:
    -   `camelCase` para métodos, funções e variáveis.
    -   `PascalCase` para classes e interfaces.
    -   `kebab-case` para nomes de arquivos e diretórios.
-   **Estrutura de Nomenclatura de Arquivos**: Os arquivos devem seguir o padrão `[name].[type].ts`. Por exemplo, uma interface para um cliente seria `client.interface.ts`.
-   **Boas Práticas**:
    -   Funções e métodos devem ter responsabilidade única, nomes verbais e no máximo 3 parâmetros.
    -   Utilizar *early returns* em vez de aninhamento de `if/else`.
    -   Preferir composição sobre herança.
    -   Inverter as dependências para recursos externos (Dependency Inversion Principle).
