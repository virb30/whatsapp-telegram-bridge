---
status: pending
parallelizable: true
blocked_by: ["1.0"]
---

<task_context>
<domain>infra/integration</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>whatsapp-web.js</dependencies>
<unblocks>["7.0"]</unblocks>
</task_context>

# Tarefa 2.0: Integração com WhatsApp (alinhada a DDD e Clean Architecture)

## Visão Geral
Implementar a integração com WhatsApp via padrão Adapter, isolando a biblioteca de terceiros `whatsapp-web.js` na camada `infrastructure`. As regras de orquestração ficam na camada `application` (casos de uso), e o modelo de sessão pertence ao `domain` como um Value Object. Nenhuma camada interna deve depender de tipos da biblioteca externa.

## Requisitos (por camada)
- Domain:
  - Modelar `WhatsAppSession` como Value Object.
  - Garantir associação de sessão por `userId` na entidade `User` (sem detalhes de persistência/ORM).
- Application:
  - Definir portas (interfaces) para comunicação com a integração: `WhatsAppGateway`.
  - Implementar casos de uso: inicialização do cliente (inclui registro do handler), streaming do QR via SSE e start dos listeners em background.
  - Trafegar apenas DTOs (sem entidades do domínio da infraestrutura ou tipos de terceiros).
  - Persistir/restaurar sessão via `UserRepository` (ou `SessionRepository`) abstrato.
- Infrastructure:
  - Implementar `WhatsAppWebJsAdapter` que atende à porta `WhatsAppGateway` usando `whatsapp-web.js`.
  - Implementar o `UserRepository` concreto (ou reusar o da tarefa 1.0), mapeando `WhatsAppSession` VO.
  - Expor endpoint SSE `GET /api/v1/whatsapp/qr/stream` para envio do QR em tempo real (polling opcional como fallback).
  - Criar um `ClientSupervisor` em memória que inicia/restaura clientes por usuário autenticado no boot e mantém listeners ativos em background.

## Subtarefas (reorganizadas)
- [ ] 2.1 Adicionar a dependência `whatsapp-web.js` apenas na camada `infrastructure`.
- [ ] 2.2 Domain: criar o Value Object `WhatsAppSession` e ajustar `User` para referência opcional à sessão.
- [ ] 2.3 Application: criar a porta `WhatsAppGateway` e os DTOs necessários.
- [ ] 2.4 Application: implementar casos de uso:
  - `InitializeWhatsAppSessionUseCase` (registra o handler de mensagens durante a inicialização)
  - `StreamQrCodeUseCase` (publica QR em um hub SSE); manter `GetWhatsAppQrCodeUseCase` apenas como fallback opcional
  - `StartListeningForUserUseCase` e `StartAllListenersUseCase` (invocado no boot para todos usuários autenticados)
- [ ] 2.5 Infrastructure: implementar `WhatsAppWebJsAdapter` (encapsula `whatsapp-web.js` e traduz para DTOs).
- [ ] 2.6 Application: persistir/restaurar `WhatsAppSession` via `UserRepository` (não por arquivo). Se optar por armazenamento alternativo, isolar atrás de `SessionStore` (porta) e fornecer implementação na infraestrutura.
- [ ] 2.7 Infrastructure: criar controlador/endpoint SSE `GET /api/v1/whatsapp/qr/stream` que delega para `StreamQrCodeUseCase` e envia eventos `qr` por `userId`.
- [ ] 2.8 Infrastructure: implementar `ClientSupervisor`/`ClientRegistry` em memória (1 cliente por `userId`), com reconexão/backoff e start no boot.
- [ ] 2.9 Observabilidade e resiliência: tratar eventos `ready`, `qr`, `auth_failure`, `disconnected`, com logs estruturados e métrica de estado do cliente por `userId`.
- [ ] 2.10 Testes (TDD): cobrir casos de uso com dublês de `WhatsAppGateway` e `UserRepository`; criar teste de contrato do adapter contra `whatsapp-web.js` (quando viável).

## Sequenciamento
- **Bloqueado por:** 1.0 (Configuração do Backend e Persistência).
- **Desbloqueia:** 7.0 (Implementação do Serviço de Encaminhamento).
- **Paralelizável:** Sim, pode avançar em paralelo com 3.0 e 4.0 (desacopladas via portas).

## Detalhes de Implementação
- Regra da dependência:
  - `domain` não conhece `application` nem `infrastructure`.
  - `application` conhece apenas portas (`WhatsAppGateway`, `UserRepository`) e trafega DTOs.
  - `infrastructure` implementa as portas usando `whatsapp-web.js` e o mecanismo de persistência.
- Multiusuário: um cliente WhatsApp por `userId`. O ciclo de vida do cliente é gerenciado por um `ClientSupervisor`/`ClientRegistry` na infraestrutura. Listeners ficam ativos em background independente de usuários logados.
- Persistência de sessão: armazenar o snapshot da sessão no repositório (campo do `User` ou repositório dedicado). Evitar arquivos locais em produção; se for necessário em desenvolvimento, encapsular atrás de `SessionStore`.
- Mensagens: o adapter converte eventos da lib em um DTO padronizado de mensagem e os encaminha para um handler registrado pela aplicação (sem expor tipos da lib). Para o MVP, o roteamento é em memória.
- QR Code: preferir SSE (ou WebSocket) para entrega em tempo real. O caso de uso publica no hub SSE; fallback por polling é opcional.
- Erros e reconexão: mapear eventos `auth_failure` e `disconnected` para estados conhecidos pela aplicação; implementar política de backoff exponencial na infraestrutura e notificar a aplicação via callbacks/eventos.
- Observabilidade: logs estruturados (incluindo `userId`), métricas básicas (estado do cliente, contagem de reconexões) e correlação por requisição.
- Segurança: não logar QR nem tokens/sessão. Criptografar a sessão em repouso, se aplicável.

## Contratos (DTOs e Portas)
Os exemplos abaixo são ilustrativos; os nomes podem ser ajustados.

```ts
// application/ports/WhatsAppGateway.ts
export interface WhatsAppGateway {
  initialize(userId: string, onQr: (qr: string) => void, onReady: () => void): Promise<void>;
  registerOnMessage(userId: string, handler: (message: IncomingMessageDTO) => Promise<void>): void;
  restoreSession(userId: string, session: WhatsAppSessionDTO): Promise<void>;
  getQr(userId: string): Promise<string | null>;
  getState(userId: string): Promise<'idle' | 'qr' | 'ready' | 'disconnected' | 'auth_failure'>;
}

// application/dto/IncomingMessageDTO.ts
export interface IncomingMessageDTO {
  messageId: string;
  chatId: string;
  from: string;
  isGroup: boolean;
  body: string;
  timestamp: number;
}

// application/dto/WhatsAppSessionDTO.ts
export interface WhatsAppSessionDTO {
  provider: 'whatsapp-web.js';
  payload: unknown; // snapshot serializado, opaco para camadas internas
  createdAt: string;
}
```

## Endpoints
- `POST /api/v1/whatsapp/connect` → chama `InitializeWhatsAppSessionUseCase` (não bloqueante). Controller extrai `userId` do JWT.
- `GET /api/v1/whatsapp/qr/stream` (SSE) → chama `StreamQrCodeUseCase` e envia eventos `qr` por `userId`. Polling (`GET /qr`) é opcional como fallback.
- Worker embutido (processo da API): no boot chama `StartAllListenersUseCase` para restaurar clientes e começar a escuta de mensagens em background.

## Critérios de Sucesso
- O frontend recebe o QR via SSE (ou WebSocket) e consegue autenticar.
- Após autenticação, a sessão é persistida no repositório e restaurada em reinícios sem novo QR.
- Listeners de WhatsApp ficam ativos em background (sem usuários logados) e capturam mensagens continuamente.
- Novas mensagens dos grupos do usuário disparam o handler registrado na aplicação (DTO padronizado) e são roteadas em memória no MVP.
- Testes dos casos de uso passam (TDD) e cobertura mínima acordada é atendida.
- A camada `domain` permanece livre de dependências de `application`/`infrastructure` e nenhum tipo de `whatsapp-web.js` vaza para camadas internas.
