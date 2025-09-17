---
status: completed
parallelizable: false
blocked_by: []
---

<task_context>
<domain>infra</domain>
<type>implementation</type>
<scope>tooling</scope>
<complexity>low</complexity>
<dependencies>eslint, prettier, husky, jest, typescript</dependencies>
<unblocks>"1.0", "8.0"</unblocks>
</task_context>

# Tarefa 0.1: Configurar Qualidade (ESLint, Prettier, Husky, TS estrito, Jest)

## Visão Geral

Configurar ferramentas de qualidade e automações para garantir padronização de código, verificação de tipos e cobertura de testes ≥ 80% antes de deploys.

## Requisitos

- ESLint + Prettier com regras alinhadas a TypeScript.
- Husky + lint-staged para pre-commit validando `lint` e `format`.
- TypeScript com `strict: true` no backend e frontend.
- Jest configurado com thresholds de cobertura (80%).
- Scripts: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn test:ci`.

## Subtarefas

- [ ] 0.1.1: Instalar e configurar ESLint e Prettier (root e apps).
- [ ] 0.1.2: Configurar Husky e lint-staged.
- [ ] 0.1.3: Ativar `strict: true` no `tsconfig` de backend e frontend.
- [ ] 0.1.4: Configurar Jest com thresholds e `test:ci` exibindo cobertura.
- [ ] 0.1.5: Adicionar scripts no `package.json` e documentação no README.

## Critérios de Sucesso

- Commits rodam hooks de lint/format com sucesso.
- `yarn typecheck` e `yarn test:ci` passam com cobertura ≥ 80% (quando testes existirem).
- CI pode usar esses scripts como gates.
