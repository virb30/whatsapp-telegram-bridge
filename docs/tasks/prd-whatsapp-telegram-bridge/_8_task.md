---
status: pending
parallelizable: false
blocked_by: ["6.0", "7.0"]
---

<task_context>
<domain>infra/devops</domain>
<type>implementation</type>
<scope>configuration</scope>
<complexity>medium</complexity>
<dependencies>docker, jest</dependencies>
<unblocks>[]</unblocks>
</task_context>

# Tarefa 8.0: Testes, Containerização e Implantação

## Visão Geral
Esta tarefa finaliza o ciclo de desenvolvimento do MVP, focando na qualidade do código, na criação de um artefato de implantação e na preparação para o ambiente de produção. Inclui a configuração de testes, a criação de um Dockerfile e a documentação dos passos de implantação.

## Requisitos
- Configurar o ambiente de testes para testes unitários e de integração.
- Criar um Dockerfile para containerizar a aplicação (backend e frontend).
- Documentar o processo de build e implantação.

## Subtarefas
- [ ] 8.1 Configurar o Jest para executar testes unitários e de integração no projeto NestJS.
- [ ] 8.2 Escrever testes de integração para os fluxos de usuário e ponte, mockando as dependências externas (`whatsapp-web.js`, `gram.js`).
- [ ] 8.3 Criar um `Dockerfile` multi-stage para buildar o frontend React e o backend NestJS em uma única imagem.
- [ ] 8.4 Otimizar a imagem Docker para produção (e.g., usando uma base de imagem Node.js slim).
- [ ] 8.5 Criar um arquivo `docker-compose.yml` para facilitar o desenvolvimento local.
- [ ] 8.6 Escrever um guia de implantação no `README.md` com os passos para configurar e iniciar a aplicação usando Docker.

## Sequenciamento
- **Bloqueado por:** 6.0 (Desenvolvimento do Frontend) e 7.0 (Implementação do Serviço de Encaminhamento).
- **Desbloqueia:** Lançamento do MVP.
- **Paralelizável:** Não.

## Detalhes de Implementação
- O Dockerfile deve primeiro buildar o frontend e depois copiar os artefatos estáticos para o diretório de serviço do backend NestJS.
- O `docker-compose.yml` deve montar os volumes de dados para persistir os arquivos de sessão e mapeamento entre reinicializações do container.

## Critérios de Sucesso
- Os testes podem ser executados com um único comando (ex: `npm test`).
- A aplicação pode ser iniciada localmente com `docker-compose up`.
- A imagem Docker é construída com sucesso e contém todos os artefatos necessários para a produção.
- A documentação de implantação é clara e suficiente para que outro desenvolvedor possa rodar o projeto.
