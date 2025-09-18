---
status: done
parallelizable: true
blocked_by: ["0.0"]
---

<task_context>
<domain>infra/backend</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>nestjs, typeorm, sqlite</dependencies>
<unblocks>["2.0", "3.0", "4.0"]</unblocks>
</task_context>

# Tarefa 1.0: Configuração do Backend e Banco de Dados (TypeORM + SQLite) em Monorepo

## Visão Geral
Esta tarefa foca em estabelecer a fundação do backend com NestJS dentro de uma estrutura de monorepo (`/backend`), incluindo a configuração do TypeORM para se conectar a um banco de dados SQLite. Serão definidas as entidades, criados os repositórios e configurada a injeção de dependência para a camada de dados.

## Requisitos
- Criar a estrutura de diretórios `/backend` e `/frontend`.
- Configurar o TypeORM no projeto NestJS dentro de `/backend`.
- Definir as entidades `User` e `Bridge` com os decoradores do TypeORM.
- Criar repositórios para interagir com as entidades.
- Garantir que a conexão com o banco de dados SQLite seja estabelecida na inicialização da aplicação.

## Subtarefas
- [x] 1.1 Criar os diretórios `backend/` e `frontend/` na raiz do projeto.
- [x] 1.2 Instalar as dependências necessárias no diretório `backend/`: `@nestjs/typeorm`, `typeorm`, `sqlite3`.
- [x] 1.3 Configurar um novo projeto NestJS dentro de `backend/`.
- [x] 1.4 Configurar o `TypeOrmModule` no `AppModule` do backend para se conectar a um arquivo de banco de dados SQLite.
- [x] 1.5 Atualizar as classes `User` e `Bridge` em `backend/src/domain/entities` para incluir os decoradores do TypeORM (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`, etc.), conforme a especificação técnica.
- [x] 1.6 Criar os módulos de funcionalidades (`UserModule`, `BridgeModule`) e importar os repositórios usando `TypeOrmModule.forFeature([User, Bridge])`.
- [x] 1.7 Criar testes de integração básicos para verificar se a conexão com o banco de dados é bem-sucedida e se os repositórios podem ser injetados.
- [x] 1.8 Adicionar o arquivo do banco de dados SQLite ao `.gitignore`.

## Sequenciamento
- **Bloqueado por:** 0.0 (Configuração de Quality Gates).
- **Desbloqueia:** 2.0, 3.0 e 4.0.
- **Paralelizável:** Sim.

## Detalhes de Implementação
- A configuração do TypeORM deve incluir `synchronize: true` para o ambiente de desenvolvimento, para que as tabelas do banco de dados sejam criadas automaticamente a partir das entidades.
- Os repositórios serão injetados nos serviços usando o decorador `@InjectRepository(Entity)`.

## Critérios de Sucesso
- A estrutura de monorepo com `backend/` e `frontend/` é criada.
- A aplicação NestJS dentro de `backend/` inicia sem erros de conexão com o banco de dados.
- As tabelas `user` e `bridge` são criadas no arquivo de banco de dados SQLite.
- Os repositórios para `User` and `Bridge` podem ser injetados com sucesso nos serviços.