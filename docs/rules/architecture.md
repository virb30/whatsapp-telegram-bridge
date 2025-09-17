# Arquitetura

Desenvolva utilizando camadas baseado nas camadas da Clean Architecture e no DDD

Leve em consideração conceitos como "Entidades", "Agregados", "Value Objects", "Use cases", "Repositories"

As camadas são: `domain`, `application`, `infrastructure`

Arquivos na camada `domain` devem refletir regras de negócio independentes como `entities`, `value-objects`

Arquivos na camada `application` devem refletir regras da aplicação que são independentes como `use-cases`, `interfaces`. Classes dessa camada devem trafegar apenas `DTOs` e nada referente ao domínio.

Arquivos na camada `infrastructure` são aqueles que fazem alguma interação com o mundo externo, por exemplo uma implementação de um `repository` ou uma implementação concreta de um `client http`

A aplicação deve estar protegida de implementações de terceiros através do padrão `adapter`.

Sempre que possível utilize padrões de projeto catalogados para simplificar o entendimento.

O repositório deverá ser um monorepo com as pastas `/frontend` e `/backend`