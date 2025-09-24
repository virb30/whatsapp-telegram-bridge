# Especificação Técnica: Ponte WhatsApp-Telegram

## Resumo Executivo

Esta especificação técnica detalha a arquitetura e a estratégia de implementação para uma aplicação web multi-usuário que funciona como uma ponte entre o WhatsApp e o Telegram. A solução será construída em uma arquitetura de 3 camadas (Domínio, Aplicação, Infraestrutura) usando NestJS para o backend e React para o frontend. A integração com o WhatsApp será realizada através da biblioteca `whatsapp-web.js`, enquanto a comunicação com o Telegram utilizará a biblioteca `gram.js`, que implementa a API de cliente do Telegram. A persistência de dados será gerenciada com **SQLite utilizando TypeORM** e o padrão de repositório, garantindo uma base de dados mais estruturada e escalável desde o MVP.

## Arquitetura do Sistema

### Visão Geral dos Componentes

A aplicação será dividida nos seguintes componentes principais:

-   **Frontend (React):** Uma interface web para cadastro de usuários, login, conexão com as plataformas (WhatsApp/Telegram), gerenciamento de mapeamentos de grupos e visualização de status.
-   **Backend (NestJS):** O núcleo da aplicação, responsável pela lógica de negócio, gerenciamento de usuários, orquestração das pontes e exposição de uma API REST para o frontend.
-   **BridgeService (Serviço de Ponte):** Um serviço de background que escuta ativamente por mensagens nos grupos de WhatsApp mapeados e as encaminha para os grupos correspondentes no Telegram.
-   **WhatsAppClient:** Um adaptador que encapsula a biblioteca `whatsapp-web.js`, gerenciando a sessão do cliente (incluindo a autenticação via QR code) e a escuta de mensagens.
-   **TelegramClient:** Um adaptador que encapsula a biblioteca `gram.js`, gerenciando a sessão do cliente (autenticação via número de telefone, código de login e 2FA) e o envio de mensagens.
-   **Camada de Dados (TypeORM):** Utilizará o TypeORM para gerenciar a conexão com o banco de dados SQLite e fornecerá repositórios para o acesso aos dados das entidades `User` e `Bridge`.

O fluxo de dados seguirá o padrão: `Frontend -> Backend API -> BridgeService -> WhatsAppClient (escuta) -> BridgeService (processa) -> TelegramClient (envia)`.

## Design de Implementação

### Interfaces Principais

```typescript
// application/interfaces/bridge.interface.ts
export interface IBridgeService {
  createBridge(userId: string, whatsappGroupId: string, telegramGroupId: string): Promise<Bridge>;
  getBridgesForUser(userId: string): Promise<Bridge[]>;
  deleteBridge(bridgeId: string): Promise<void>;
}

// application/interfaces/user.interface.ts
export interface IUserService {
  createUser(email: string, password_hash: string): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
}

// application/interfaces/whatsapp.interface.ts
export interface IWhatsAppService {
  initializeClient(userId: string): Promise<void>;
  getQRCode(userId: string): Promise<string>;
  onMessage(userId: string, handler: (message: any) => void): void;
  getStatus(userId: string): Promise<string>;
}

// application/interfaces/telegram.interface.ts
export interface ITelegramService {
    initializeClient(userId: string, phone: string, code: string, password?: string): Promise<void>;
    sendMessage(userId: string, groupId: string, message: string): Promise<void>;
    getStatus(userId: string): Promise<string>;
}
```

### Modelos de Dados

```typescript
// domain/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bridge } from './bridge.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  whatsappSession?: string; // Armazenado como JSON string

  @Column({ type: 'text', nullable: true })
  telegramSession?: string;

  @OneToMany(() => Bridge, bridge => bridge.user)
  bridges: Bridge[];
}

// domain/entities/bridge.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Bridge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  whatsappGroupId: string;

  @Column()
  telegramGroupId:string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.bridges)
  user: User;
}
```

### Endpoints de API

-   `POST /api/v1/users`: Cria um novo usuário.
-   `POST /api/v1/auth/login`: Autentica um usuário e retorna um token.
-   `POST /api/v1/bridges`: Cria um novo mapeamento de grupo (ponte).
-   `GET /api/v1/bridges`: Lista os mapeamentos do usuário autenticado.
-   `DELETE /api/v1/bridges/:id`: Remove um mapeamento.
-   `GET /api/v1/whatsapp/qr`: Obtém o QR code para conectar a conta do WhatsApp.
-   `POST /api/v1/telegram/connect`: Inicia a conexão com o Telegram (envia número, recebe pedido de código).
-   `POST /api/v1/telegram/signin`: Finaliza a conexão (envia código e senha 2FA, se houver).
-   `GET /api/v1/status`: Retorna o status das conexões com WhatsApp e Telegram.

#### Contratos de API - Bridges

-   `GET /api/v1/bridges`
    -   Response 200:
    ```json
    {
      "items": [
        { "id": "<uuid>", "whatsappGroupId": "<string>", "telegramGroupId": "<string>" }
      ]
    }
    ```

-   `POST /api/v1/bridges`
    -   Request body:
    ```json
    { "whatsappGroupId": "<string>", "telegramGroupId": "<string>" }
    ```
    -   Response 201:
    ```json
    { "id": "<uuid>" }
    ```

-   `DELETE /api/v1/bridges/:id`
    -   Response 204: Sem corpo

## Pontos de Integração

-   **WhatsApp:** A integração será feita com a biblioteca `whatsapp-web.js`. A autenticação será via QR code e a sessão será persistida no banco de dados para evitar logins repetidos. O tratamento de erros para desconexão será crucial.
-   **Telegram:** A integração será via `gram.js`, que utiliza a API de cliente do Telegram. A autenticação exigirá que o usuário forneça seu número de telefone, um código de login enviado ao seu app do Telegram e, potencialmente, uma senha de autenticação de dois fatores (2FA). A sessão do cliente será persistida no banco de dados para evitar logins repetidos.

## Análise de Impacto

Como este é um projeto greenfield, não há impacto em componentes existentes. Todos os componentes listados serão criados do zero.

| Componente Afetado | Tipo de Impacto | Descrição & Nível de Risco | Ação Requerida |
| :--- | :--- | :--- | :--- |
| N/A | N/A | Projeto inicial, sem componentes preexistentes. | N/A |

## Abordagem de Testes

### Testes Unitários

-   **Componentes:** As entidades de domínio, casos de uso da aplicação e serviços de infraestrutura (com mocks) serão testados unitariamente.
-   **Mocks:** As integrações externas (`WhatsAppClient`, `TelegramClient`) e os repositórios do TypeORM serão mockados para isolar a lógica de negócio.
-   **Cenários Críticos:** Testar a lógica de criação de usuário, criação de ponte e o fluxo de encaminhamento de mensagens.

### Testes de Integração

-   **Componentes:** Testar a interação entre a API do backend e a camada de dados para garantir que os dados são salvos e lidos corretamente no banco de dados SQLite.
-   **Diretório:** Os testes de integração ficarão em `test/integration/`.

## Sequenciamento de Desenvolvimento

1.  **Configuração do Backend e Banco de Dados:** Estruturar o projeto NestJS, configurar o TypeORM com o driver do SQLite, definir as entidades e criar os repositórios de dados.
2.  **Integração com WhatsApp:** Implementar o `WhatsAppClient`, incluindo a geração de QR code, gerenciamento de sessão e escuta de mensagens.
3.  **Integração com Telegram:** Implementar o `TelegramClient` com `gram.js`, incluindo o fluxo de autenticação de usuário (telefone, código, 2FA) e envio de mensagens.
4.  **Desenvolvimento do Core:** Implementar os serviços de `User` e `Bridge`, e os endpoints da API.
5.  **Desenvolvimento do Frontend:** Criar a interface em React para todas as funcionalidades descritas no PRD, incluindo o novo fluxo de login do Telegram.
6.  **Testes e Implantação:** Realizar testes E2E manuais e automatizados, containerizar a aplicação e implantar no GCP.

## Monitoramento e Observabilidade

-   **Métricas:** Expor métricas no formato Prometheus para o número de mensagens encaminhadas, número de usuários ativos e status das conexões.
-   **Logs:** Utilizar logs estruturados para registrar eventos importantes, como inicialização de cliente, falhas de conexão e mensagens processadas.

## Considerações Técnicas

### Decisões Principais

-   **Backend:** NestJS foi escolhido por seu suporte a TypeScript e arquitetura modular, que se alinha bem com os princípios de DDD e Clean Architecture.
-   **Frontend:** React com Vite foi escolhido para um desenvolvimento rápido e uma experiência de usuário moderna.
-   **Integração Telegram:** `gram.js` foi escolhido para permitir que a aplicação atue como um usuário normal do Telegram, o que é consistente com a abordagem de integração do WhatsApp e permite interagir com grupos sem a necessidade de ser um administrador ou usar um bot.
-   **Persistência:** SQLite com TypeORM foi escolhido para fornecer uma solução de banco de dados relacional leve e embarcada desde o MVP, facilitando a estruturação dos dados e a escalabilidade futura, ao mesmo tempo que mantém a configuração simples.

### Riscos Conhecidos

-   **Instabilidade da API de Cliente:** Tanto `whatsapp-web.js` quanto `gram.js` dependem de APIs não oficiais (ou de cliente) que podem mudar ou ser bloqueadas, resultando em instabilidade. A mitigação envolve monitoramento constante, tratamento robusto de erros de sessão e comunicação transparente com os usuários.
-   **Segurança Multi-usuário:** Isolar os dados e as sessões de cada usuário é crítico. A lógica de acesso a dados deve garantir que um usuário não possa acessar informações de outro.

### Conformidade com Padrões

A implementação seguirá estritamente as regras definidas em `docs/rules/architecture.md` e `docs/rules/node.md`, incluindo a estrutura de camadas, o uso de TypeScript, e os padrões de código.
