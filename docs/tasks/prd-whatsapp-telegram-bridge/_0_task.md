---
status: pending
parallelizable: false
blocked_by: []
---

<task_context>
<domain>infra/devops</domain>
<type>configuration</type>
<scope>quality_gates</scope>
<complexity>medium</complexity>
<dependencies>husky, lint-staged, eslint, typescript, jest</dependencies>
<unblocks>["1.0"]</unblocks>
</task_context>

# Tarefa 0.0: Configuração de Quality Gates

## Visão Geral
Esta tarefa estabelece as ferramentas de qualidade de código que serão executadas automaticamente antes de cada commit. O objetivo é garantir que todo código enviado ao repositório siga os padrões de estilo, não contenha erros de lint ou de tipo, e passe nos testes automatizados.

## Requisitos
- Configurar o Husky para gerenciar ganchos (hooks) do Git.
- Usar o `lint-staged` para rodar scripts em arquivos que estão no "stage" do Git.
- O hook de `pre-commit` deve executar o linter, o formatador, a checagem de tipos e os testes.

## Subtarefas
- [ ] 0.1 Instalar as dependências de desenvolvimento: `husky`, `lint-staged`.
- [ ] 0.2 Inicializar o Husky para criar a pasta `.husky`.
- [ ] 0.3 Criar o hook de `pre-commit` em `.husky/pre-commit`.
- [ ] 0.4 Configurar o `lint-staged` no `package.json` para executar:
    - `eslint --fix` em arquivos `.ts` e `.js`.
    - `prettier --write` em todos os arquivos suportados.
    - `tsc --noEmit` para checagem de tipos.
- [ ] 0.5 Adicionar um script no `package.json` para rodar os testes (ex: `test:staged`).
- [ ] 0.6 Modificar o hook `pre-commit` para executar `npx lint-staged`.
- [ ] 0.7 Garantir que o hook de `pre-commit` bloqueia commits que não atendam aos critérios de qualidade.

## Sequenciamento
- **Bloqueado por:** Nenhuma.
- **Desbloqueia:** 1.0 (Configuração do Backend e Banco de Dados).
- **Paralelizável:** Não.

## Detalhes de Implementação
- A configuração do `lint-staged` deve ser granular para rodar apenas as checagens relevantes nos arquivos modificados, otimizando o tempo de execução do commit.

## Critérios de Sucesso
- O comando `git commit` é interrompido se houver erros de lint, tipo ou teste nos arquivos em "stage".
- O código é formatado automaticamente antes do commit.
- A configuração está devidamente documentada no `README.md` se necessário.
