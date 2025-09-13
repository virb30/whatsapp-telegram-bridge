---
status: completed
parallelizable: true
blocked_by: []
---

<task_context>
<domain>engine/infra/setup</domain>
<type>implementation</type>
<scope>configuration</scope>
<complexity>low</complexity>
<dependencies></dependencies>
<unblocks>"2.0", "3.0"</unblocks>
</task_context>

# Tarefa 1: Configuração Inicial do Projeto

**Descrição:**
O objetivo desta tarefa é configurar a estrutura inicial do projeto Node.js com TypeScript, instalar as dependências principais e configurar as ferramentas de desenvolvimento, como linter e formatter. Esta base garantirá um ambiente de desenvolvimento consistente e produtivo.

**Critérios de Aceitação:**
- [x] Inicializar um projeto Node.js com `yarn`.
- [x] Configurar o TypeScript no projeto, incluindo um arquivo `tsconfig.json` com as diretrizes do projeto (strict mode, module resolution).
- [x] Instalar as dependências principais: `whatsapp-web.js`, `telegraf`, e `pino`.
- [x] Instalar as dependências de desenvolvimento: `@types/node`, `typescript`, `eslint`, `prettier`, `jest`.
- [x] Configurar o ESLint e o Prettier para garantir a qualidade e a consistência do código.
- [x] Criar a estrutura de diretórios inicial (`src/domain`, `src/application`, `src/infrastructure`). (Nota: a criação do diretório `src/domain` foi adiada)

**Nota:** A instalação do `puppeteer` (uma dependência do `whatsapp-web.js`) foi feita pulando o download do Chromium. Será necessário configurar o `executablePath` no cliente do `whatsapp-web.js` para apontar para uma instalação local do Chrome/Chromium.
