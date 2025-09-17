# Automação de Desenvolvimento com Agentes de IA

Este repositório contém um framework projetado para automatizar o ciclo de vida do desenvolvimento de software utilizando Agentes de IA. O sistema é estruturado para guiar os agentes através de um fluxo de trabalho completo, desde o planejamento e especificação até a execução e revisão de tarefas.

## Visão Geral

O objetivo principal é fornecer um ambiente onde agentes de IA possam colaborar de forma eficiente para construir e manter software. Isso é alcançado através de:

- **Agentes Especializados**: Cada agente possui uma função específica (ex: criar PRDs, gerar especificações técnicas, criar listas de tarefas).
- **Fluxo de Trabalho Estruturado**: Um processo claro que começa com a definição de requisitos e avança sequencialmente para a implementação.
- **Templates Padronizados**: Uso de templates para garantir que os documentos (PRDs, Tech Specs, Tarefas) sejam consistentes e completos.
- **Regras e Padrões**: Um conjunto de diretrizes (`/docs/rules`) que os agentes devem seguir para garantir a qualidade e a conformidade do código.

## Estrutura do Repositório

- **`.agents/`**: Contém as definições e os prompts para cada agente de IA especializado. É aqui que o "cérebro" de cada agente é moldado.
- **`.cursor/` e `.gemini/`**: Armazenam a configuração dos comandos que invocam os agentes, adaptados para os ambientes Cursor e Gemini.
- **`docs/`**: O coração da documentação do projeto.
  - **`_templates/`**: Guarda os modelos para PRDs, especificações técnicas e tarefas.
  - **`rules/`**: Define os padrões de codificação, arquitetura e outras diretrizes que os agentes devem seguir.
  - **`tasks/`**: Diretório dinâmico onde os artefatos gerados (PRDs, specs, listas de tarefas) para cada nova funcionalidade são armazenados.
- **`whatsapp-telegram-bridge/`**: Um projeto de exemplo que está sendo (ou foi) desenvolvido utilizando este framework de agentes.

## Fluxo de Trabalho (Workflow)

O processo de desenvolvimento é dividido nas seguintes etapas principais, executadas por agentes específicos:

1.  **Criação do PRD (Product Requirements Document)**
    - **Comando**: `create-prd "<descrição da funcionalidade>"`
    - **Agente**: `prd-creator-agent`
    - **Processo**: O agente faz perguntas para refinar os requisitos e, em seguida, gera um documento de requisitos do produto (`_prd.md`) a partir de um template, salvando-o em `docs/tasks/prd-[nome-da-funcionalidade]/`.

2.  **Criação da Especificação Técnica (Tech Spec)**
    - **Comando**: `create-techspec "<nome-da-funcionalidade>"`
    - **Agente**: `techspec-creator-agent`
    - **Processo**: Com base no PRD, este agente gera uma especificação técnica detalhada (`_techspec.md`), descrevendo o "como" da implementação.

3.  **Criação de Tarefas**
    - **Comando**: `create-tasks "<nome-da-funcionalidade>"`
    - **Agente**: `tasks-creator-agent`
    - **Processo**: O agente analisa o PRD e a Tech Spec para quebrar o trabalho em tarefas de desenvolvimento detalhadas, identificando dependências e oportunidades de paralelização. Os arquivos de tarefa são salvos em `docs/tasks/prd-[nome-da-funcionalidade]/`.

4.  **Execução e Revisão**
    - **Agentes**: `task-implementor-agent` e `task-reviewer-agent`
    - **Processo**: Agentes de desenvolvimento pegam as tarefas geradas, implementam o código e, em seguida, um agente de revisão valida o trabalho, garantindo que ele siga as especificações e os padrões de qualidade.

## Como Usar

Os comandos a seguir devem ser executados em um ambiente de desenvolvimento integrado com IA (como Cursor, Gemini CLI, etc.) que esteja configurado para usar os agentes deste repositório.

1.  **Defina uma Nova Funcionalidade**: Comece descrevendo a funcionalidade que você deseja construir.
    ```
    /create-prd "Um sistema de login de usuário com autenticação de dois fatores"
    ```

2.  **Gere a Especificação Técnica**: Uma vez que o PRD esteja completo e aprovado, gere a especificação técnica.
    ```
    /create-techspec "sistema-de-login-2fa"
    ```

3.  **Crie as Tarefas de Desenvolvimento**: Com os documentos de planejamento em mãos, gere a lista de tarefas.
    ```
    /create-tasks "sistema-de-login-2fa"
    ```

4.  **Execute as Tarefas**: Utilize os agentes de implementação para começar a codificar, uma tarefa de cada vez.

Este framework visa otimizar o processo de desenvolvimento, reduzir a ambiguidade e garantir que o produto final esteja alinhado com os requisitos iniciais, tudo isso com a ajuda de agentes de IA autônomos e especializados.

## Qualidade e Cobertura

- Rode o linter: `yarn lint`
- Rode os testes: `yarn test`
- Verifique tipos: `yarn typecheck`
- Formate código: `yarn format`
- Valide cobertura mínima (80% global): `yarn test:ci`
