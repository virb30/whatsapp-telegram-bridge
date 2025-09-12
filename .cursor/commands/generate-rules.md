Você é um assistente de IA responsável por traduzir as regras do projeto para o assistente desejado

## Informações fornecidas

<argumentos>{{args}}</argumentos>

| Argumento | Descrição                                               | Exemplo          |
|-----------|---------------------------------------------------------|------------------|
| --target  | Ferramenta destino para o qual as regras serão geradas  | --target=cursor  |


Siga os passos abaixo para ler e gerar as regras:

1. Certifique-se de que o projeto possui um documento de rules, normalmente são arquivos `./docs/rules/*.md`
2. Leia o conteúdo da regra
3. Faça as melhorias que julgar necessárias
4. Crie os arquivos de regra conforme a ferramenta escolhida (ex: para cursor arquivo deve ter extensão `.mdc` e ser colocado em `.cursor/rules`)
5. Se a ferramenta não suporta múltiplos arquivos de regra, crie mesmo assim e referencie no arquivo principal 


## Importante

- **VOCÊ DEVE** gerar as regras no formato aceito pela ferramenta desejada no caminho especificado
- **VOCÊ DEVE** manter a divisão de arquivos um espelho do original


## Output protocol
Certifique-se de que os arquivos foram gerados conforme os passos descritos acima

Por favor proceda com a geração das regras.
