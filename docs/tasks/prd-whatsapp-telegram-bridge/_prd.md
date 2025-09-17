# PRD: Ponte WhatsApp-Telegram

## Visão Geral

Este documento descreve os requisitos para uma aplicação web **multi-tenant** que atua como uma ponte entre o WhatsApp e o Telegram. A aplicação permitirá que **vários usuários se cadastrem e configurem suas próprias pontes**, conectando suas contas para encaminhar mensagens automaticamente de grupos específicos do WhatsApp para grupos correspondentes no Telegram. O principal problema que este produto resolve é a necessidade de centralizar ou espelhar a comunicação de um grupo do WhatsApp para um ambiente do Telegram, sem intervenção manual. O público-alvo são usuários que participam de comunidades em ambas as plataformas e desejam manter um fluxo de informação unidirecional entre elas.

## Objetivos

- **Conectividade Simplificada:** Permitir que o usuário conecte sua conta do WhatsApp (como conta de usuário via QR code) e sua conta do Telegram de forma segura e intuitiva.
- **Mapeamento Flexível de Grupos:** Oferecer uma interface para que o usuário possa criar, visualizar e gerenciar mapeamentos 1-para-1 entre seus grupos do WhatsApp e do Telegram.
- **Encaminhamento Automático e Confiável:** Garantir que as mensagens enviadas pelo usuário em um grupo mapeado do WhatsApp sejam encaminhadas para o grupo correspondente do Telegram em tempo real.
- **Suporte a Múltiplos Usuários (Multi-tenant):** A arquitetura deve ser capaz de gerenciar as sessões, cadastros e mapeamentos de múltiplos usuários de forma independente e segura.
- **Monitoramento de Status:** Fornecer uma interface clara onde o usuário possa verificar o status da conexão com o WhatsApp e o Telegram.

## Histórias de Usuário

- Como um usuário, eu quero me cadastrar na plataforma para poder configurar minha própria ponte de mensagens.
- Como um usuário, eu quero conectar minha conta do WhatsApp à aplicação usando um QR code, assim como faço no WhatsApp Web, para que a aplicação possa monitorar minhas mensagens.
- Como um usuário, eu quero autorizar a aplicação a enviar mensagens em meu nome no Telegram, para que ela possa encaminhar o conteúdo do WhatsApp.
- Como um usuário, eu quero acessar uma interface onde eu possa selecionar um dos meus grupos do WhatsApp e associá-lo a um dos meus grupos do Telegram, criando um "dicionário" de encaminhamento.
- Como um usuário, sempre que eu enviar uma mensagem (texto, imagem ou link) em um grupo do WhatsApp que foi mapeado, eu quero que essa mesma mensagem apareça no grupo do Telegram associado.
- Como um usuário, eu quero ter uma página de status para verificar rapidamente se a conexão com o WhatsApp e o Telegram está ativa e funcionando.
- Como um usuário, quero ser notificado no Telegram se minha conexão com o WhatsApp cair, e no WhatsApp se minha conexão com o Telegram cair, para que eu possa agir rapidamente para reconectar.

## Funcionalidades Principais

1.  **Autenticação de Usuário e Plataformas:**
    - **Cadastro na Plataforma:** Sistema de cadastro para que múltiplos usuários possam criar contas.
    - **WhatsApp:** Integração para geração de QR code e gerenciamento da sessão do cliente (conta de usuário). A sessão deve ser persistida para evitar logins repetidos.
    - **Telegram:** Conexão com a API do Telegram para permitir o envio de mensagens.
2.  **Interface de Mapeamento de Grupos:**
    - Uma página na aplicação web onde o usuário, após conectar ambas as contas, verá uma lista de seus grupos do WhatsApp e do Telegram.
    - Funcionalidade para criar, visualizar e excluir associações entre um grupo de origem (WhatsApp) e um grupo de destino (Telegram).
3.  **Serviço de Encaminhamento em Segundo Plano:**
    - Um processo de backend que permanece ativo, escutando por novas mensagens nos grupos do WhatsApp que foram mapeados.
    - O serviço deve identificar quando uma mensagem é enviada pelo **usuário administrador da conta (que realizou o vínculo)**.
    - Ao detectar uma nova mensagem (texto, imagem ou link), o serviço a formata e a envia para o grupo do Telegram correspondente.
4.  **Dashboard de Status (Interface Web):**
    - Uma seção na interface que exibe o status da conexão: "Conectado" ou "Desconectado" para o WhatsApp e para o Telegram.
    - Deve fornecer feedback claro em caso de falha na conexão (ex: "Sessão do WhatsApp expirada, por favor, conecte-se novamente").

## Experiência do Usuário

A interface será minimalista e focada na funcionalidade.
- **Página Inicial/Login:** Apresentará as opções para cadastro e login, e em seguida para conectar ao WhatsApp e ao Telegram.
- **Página de Mapeamento:** Uma interface intuitiva de duas colunas (ou similar) para associar os grupos.
- **Página de Status:** Exibição clara e direta do estado das conexões.
O fluxo principal do usuário será: 1. Cadastrar/Login -> 2. Conectar WhatsApp -> 3. Conectar Telegram -> 4. Criar Mapeamentos -> 5. Verificar Status.

## Restrições Técnicas de Alto Nível

- **Implantação:** O backend será containerizado e implantado em uma VM no Google Cloud Platform (GCP).
- **Persistência de Dados (MVP):** Para o MVP, a persistência de dados (sessões de usuário, mapeamentos de grupo) será feita em arquivos no sistema de arquivos local. A sessão do WhatsApp será gerenciada diretamente pela biblioteca `whatsapp-web.js`. O uso de um banco de dados dedicado é planejado para uma versão futura.
- **Dependências Externas:** A integração com o WhatsApp dependerá de bibliotecas de terceiros (ex: `whatsapp-web.js`), o que introduz um risco de instabilidade. A comunicação com o Telegram será feita através de sua API oficial.
- **Segurança:** A privacidade e segurança dos dados do usuário são cruciais.

## Não Objetivos (Fora do Escopo)

- **Encaminhamento Bidirecional:** A aplicação não encaminhará mensagens do Telegram para o WhatsApp.
- **Encaminhamento de Mensagens de Outros Membros:** O encaminhamento se aplica estritamente às mensagens enviadas pelo usuário que configurou a ponte, não às mensagens de outros membros do grupo.
- **Gerenciamento de Grupos:** A aplicação não permitirá criar, editar ou deletar grupos do WhatsApp ou Telegram.

## Plano de Lançamento em Fases

- **MVP (Web Interface):**
    - Suporte ao cadastro de múltiplos usuários e login.
    - Conexão com a conta de usuário do WhatsApp e Telegram.
    - Interface para o usuário gerenciar seus mapeamentos de grupo (criar, visualizar, excluir).
    - Encaminhamento de mensagens de **texto, imagens e links**.
    - Dashboard de status básico na interface web.
    - *Nota Técnica:* Persistência de sessão e mapeamentos baseada em arquivos.
- **Fase 2 (V2 - Escalabilidade e Notificações):**
    - **Migração para Banco de Dados:** Migrar a persistência de dados de arquivos para uma solução de banco de dados robusta.
    - **Notificações via mensagem (cross-platform):** Enviar uma notificação para o Telegram do usuário se a conexão com o WhatsApp cair, e vice-versa.
    - Encaminhamento de outros tipos de mídia (vídeos, documentos).
- **Futuro:**
    - Otimizações de desempenho e confiabilidade.
    - Análise de logs para o usuário.

## Métricas de Sucesso

- Número de usuários ativos.
- Número de mensagens encaminhadas com sucesso por dia.
- Tempo de atividade (uptime) do serviço de encaminhamento.
- Taxa de retenção de usuários após a configuração inicial.

## Riscos e Mitigações

- **Risco:** A API não oficial do WhatsApp pode se tornar instável ou ser bloqueada.
  - **Mitigação:** Utilizar bibliotecas bem mantidas pela comunidade, ter um sistema de monitoramento para detectar falhas rapidamente e comunicar claramente aos usuários sobre possíveis instabilidades.
- **Risco:** Questões de privacidade e segurança ao manusear dados de múltiplos usuários.
  - **Mitigação:** Implementar criptografia para dados sensíveis, seguir as melhores práticas de segurança para aplicações multi-tenant e ser transparente com o usuário sobre quais dados são armazenados.

## Questões em Aberto

- **Rate Limiting:** A gestão de limites de taxa (rate limiting) será ignorada no MVP. Como isso será tratado em versões futuras para garantir escalabilidade e evitar bloqueios?
- **Migração de Dados:** Qual será a estratégia de migração da persistência baseada em arquivos para um banco de dados robusto no futuro?
