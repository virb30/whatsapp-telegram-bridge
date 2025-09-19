# Revisão da Tarefa 2.0: Configuração de CI/CD

## 1. Validação da Definição da Tarefa

A implementação está **majoritariamente alinhada** com os requisitos da Tarefa 2.0. Os workflows para backend e frontend (`backend-ci-cd.yml`, `frontend-ci-cd.yml`) foram criados e contêm os passos essenciais para build, teste e deploy.

- **Backend:** O workflow automatiza o build da imagem Docker, push para o Artifact Registry e deploy via SSH na GCP.
- **Frontend:** O workflow executa testes e aciona o deploy para a Vercel em pushes para a `main`.

Todos os requisitos da tarefa foram abordados na implementação inicial.

## 2. Análise de Regras e Revisão de Código

A revisão identificou pontos críticos de melhoria, especialmente no workflow do backend, focando em segurança, corretude e boas práticas.

### `backend-ci-cd.yml`

-   **[CRÍTICO] Risco de Segurança no Deploy:**
    -   **Problema:** O script de deploy executado via SSH (`appleboy/ssh-action`) contém o comando `docker login -u _json_key -p '${{ secrets.GCP_SA_KEY_JSON }}' ...`. Passar a chave da Service Account diretamente como um argumento de linha de comando é uma prática insegura, pois a chave pode ser exposta em logs ou no histórico de comandos da VM.
    -   **Recomendação:** Remova este comando `docker login`. A VM na GCP deve ser autenticada de forma segura, preferencialmente associando uma Service Account à própria instância. A VM então terá permissão para fazer pull de imagens do Artifact Registry sem a necessidade de login explícito no script.

-   **[ALTO] Comandos de CI Incorretos no Workspace NX:**
    -   **Problema:** Os passos de `Lint` e `Test` executam `yarn lint` and `yarn test` a partir da raiz do projeto. Em um monorepo NX, isso pode não executar as validações específicas do projeto `backend`.
    -   **Recomendação:** Utilize os comandos do NX para garantir que os testes e o lint sejam executados no escopo correto. Substitua os comandos por:
        ```yaml
        - name: Lint
          run: yarn nx run backend:lint
        - name: Test
          run: yarn nx run backend:test --silent
        ```

-   **[MÉDIO] Lógica de Deploy Frágil:**
    -   **Problema:** O script de deploy usa `docker pull "$IMAGE_NAME:$IMAGE_TAG" || docker pull "$IMAGE_NAME:latest"`. Se o pull da tag específica falhar, o sistema tentará baixar a `latest`, que pode ser uma versão diferente da que acionou o workflow, levando a um deploy incorreto.
    -   **Recomendação:** Remova o fallback para `:latest`. O workflow deve falhar se a imagem com a tag específica (`github.sha`) não puder ser baixada. Isso garante que apenas a versão testada seja implantada.
        ```bash
        # Altere para:
        docker pull "$IMAGE_NAME:$IMAGE_TAG"
        ```

-   **[BAIXO] Contexto de Build do Docker Ineficiente:**
    -   **Problema:** O comando `docker build` é executado no diretório raiz (`.`), o que envia todo o conteúdo do monorepo (incluindo `node_modules` da raiz, outras apps, etc.) para o daemon do Docker. Isso é ineficiente e lento.
    -   **Recomendação:** Mude o contexto do build para o diretório do backend.
        ```yaml
        - name: Build backend Docker image
          run: |
            docker build -f backend/Dockerfile -t "$IMAGE_NAME:$IMAGE_TAG" -t "$IMAGE_NAME:latest" ./backend
        ```
        *Nota: Se o Dockerfile espera o contexto na raiz, certifique-se de que o `.dockerignore` na raiz seja abrangente para excluir arquivos e pastas desnecessários.*

### `frontend-ci-cd.yml`

O workflow do frontend está bem estruturado e segue as melhores práticas para um projeto NX.

-   **[BAIXO] Código Redundante:**
    -   **Problema:** O passo `Trigger Vercel Deploy` define a variável de ambiente `VERCEL_TOKEN` no bloco `env`, mas ela já é passada para a action através de `with.vercel-token`.
    -   **Recomendação:** Para maior clareza, remova o bloco `env` redundante.
        ```yaml
        # Remover este bloco
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        ```

## 3. Resumo e Próximos Passos

A implementação cumpre a funcionalidade básica da tarefa, mas as correções no workflow do backend são **obrigatórias** antes de considerar a tarefa concluída, especialmente a falha de segurança no método de autenticação do Docker na VM.

**Ações Recomendadas:**
1.  **Corrigir o método de autenticação** na VM da GCP para o Artifact Registry.
2.  **Ajustar os comandos de CI** do backend para usar o NX.
3.  **Remover o fallback** para a imagem `:latest` no script de deploy.
4.  Otimizar o contexto do build do Docker.
5.  Limpar o código redundante no workflow do frontend.

Após a aplicação dessas correções, a tarefa estará em conformidade com os padrões de segurança e melhores práticas do projeto.

Peço que revise os pontos levantados e aplique as correções sugeridas. Após a atualização, farei uma nova revisão para garantir que tudo está conforme o esperado.
