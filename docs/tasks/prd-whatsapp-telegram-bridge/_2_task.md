---
status: pending
parallelizable: false
blocked_by: ["1.0"]
---

<task_context>
<domain>infra/devops</domain>
<type>configuration</type>
<scope>ci_cd</scope>
<complexity>high</complexity>
<dependencies>github_actions, gcp, vercel</dependencies>
<unblocks>["3.0"]</unblocks>
</task_context>

# Tarefa 2.0: Configuração de CI/CD (Backend GCP, Frontend Vercel)

## Visão Geral
Esta tarefa foca na automação do processo de integração contínua e deploy contínuo (CI/CD) para o backend e o frontend. O backend será implantado na GCP via GitHub Actions, enquanto o frontend será implantado na Vercel.

## Requisitos
- Configurar GitHub Actions para o repositório.
- Automatizar o build da imagem Docker do backend.
- Automatizar o push da imagem Docker para o Artifact Registry (GCP) ou Docker Hub.
- Automatizar o deploy do backend para uma VM na GCP via SSH.
- Configurar o deploy automático do frontend na Vercel.

## Subtarefas
- [ ] 2.1 Criar um workflow de GitHub Actions (`.github/workflows/backend-ci-cd.yml`) para o backend.
- [ ] 2.2 No workflow do backend, configurar os passos para:
    - Fazer o checkout do código.
    - Fazer o login no Docker (ou GCP Artifact Registry).
    - Buildar a imagem Docker do backend (localizado em `backend/`).
    - Taggear e fazer o push da imagem para o registro de containers.
    - Conectar via SSH à VM da GCP e executar comandos para atualizar o container (ex: `docker pull`, `docker stop`, `docker rm`, `docker run`).
- [ ] 2.3 Configurar as variáveis de ambiente e segredos necessários no GitHub Secrets (ex: credenciais GCP, chave SSH, tokens de acesso).
- [ ] 2.4 Criar um workflow de GitHub Actions (`.github/workflows/frontend-ci-cd.yml`) para o frontend.
- [ ] 2.5 No workflow do frontend, configurar o deploy automático para a Vercel (geralmente via integração direta da Vercel com o GitHub).
- [ ] 2.6 Garantir que o deploy do frontend na Vercel seja acionado em push para a branch `main`.

## Sequenciamento
- **Bloqueado por:** 1.0 (Configuração do Backend e Banco de Dados).
- **Desbloqueia:** 3.0 (Desenvolvimento do Core do Usuário).
- **Paralelizável:** Não.

## Detalhes de Implementação
- Para o deploy na GCP, pode-se usar `gcloud compute ssh` ou uma ação de SSH do GitHub Actions.
- A Vercel geralmente detecta automaticamente projetos React e configura o deploy.

## Critérios de Sucesso
- Um push para a branch `main` do repositório aciona automaticamente o build e deploy do backend na GCP.
- Um push para a branch `main` do repositório aciona automaticamente o deploy do frontend na Vercel.
- A aplicação (backend e frontend) está acessível e funcionando após o deploy automático.