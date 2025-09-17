# Implementação Ponte WhatsApp-Telegram - Resumo de Tarefas

## Fase 0: Quality Gates

- [ ] 0.0 **Configuração de Quality Gates:** Configurar Husky, lint-staged, checagem de tipos e testes para garantir a qualidade do código.

## Fase 1: Configuração e Integrações Principais

- [ ] 1.0 **Configuração do Backend e Banco de Dados (TypeORM + SQLite) em Monorepo:** Estruturar o projeto NestJS, definir a arquitetura de 3 camadas (Domínio, Aplicação, Infraestrutura) e implementar o `PersistenceService` com base em arquivos JSON.
- [ ] 2.0 **Integração com WhatsApp:** Implementar o `WhatsAppClient` usando `whatsapp-web.js`, incluindo geração de QR code, gerenciamento de sessão e escuta de mensagens.
- [ ] 3.0 **Integração com Telegram:** Implementar o `TelegramClient` com `gram.js`, cobrindo o fluxo completo de autenticação (telefone, código, 2FA) e a funcionalidade de envio de mensagens.

## Fase 2: Lógica de Negócio e API

- [ ] 4.0 **Desenvolvimento do Core do Usuário:** Implementar o `UserService` e os endpoints da API para cadastro e autenticação de usuários.
- [ ] 5.0 **Desenvolvimento do Core da Ponte:** Implementar o `BridgeService` e os endpoints da API para criar, listar e deletar mapeamentos de grupos.

## Fase 3: Frontend e Finalização

- [ ] 6.0 **Desenvolvimento do Frontend (React):** Criar a interface do usuário para cadastro, login, conexão com as plataformas, gerenciamento de mapeamentos e dashboard de status.
- [ ] 7.0 **Implementação do Serviço de Encaminhamento:** Desenvolver o serviço de background que conecta a lógica do `WhatsAppClient` e do `TelegramClient` para encaminhar as mensagens.
- [ ] 8.0 **Testes, Containerização e Implantação:** Configurar testes unitários e de integração, criar o Dockerfile e preparar o ambiente para implantação no GCP.
- [ ] 9.0 **Configuração de CI/CD (Backend GCP, Frontend Vercel):** Automatizar o build, push e deploy do backend na GCP e do frontend na Vercel.
