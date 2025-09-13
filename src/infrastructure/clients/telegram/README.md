# TelegramClient

Cliente para integração com a API do Telegram Bot. Responsável por enviar mensagens para grupos do Telegram.

## Funcionalidades

- ✅ Envio de mensagens de texto
- ✅ Envio de imagens com ou sem legenda
- ✅ Envio de links
- ✅ Tratamento robusto de erros da API
- ✅ Suporte a variáveis de ambiente para configuração segura
- ✅ Testes unitários completos

## Configuração

### Variáveis de Ambiente

Configure a seguinte variável de ambiente:

```bash
export TELEGRAM_BOT_TOKEN="seu_token_do_bot_aqui"
```

### Obtendo um Token do Bot

1. Abra o Telegram e procure por `@BotFather`
2. Envie o comando `/newbot`
3. Siga as instruções para criar seu bot
4. Copie o token fornecido pelo BotFather
5. Configure a variável de ambiente `TELEGRAM_BOT_TOKEN`

## Uso Básico

```typescript
import { TelegramClient } from './infrastructure/clients/telegram/telegram.client';
import { MessageDTO as Message } from '../../application/dtos/message.dto';

// Criar instância do cliente
const telegramClient = new TelegramClient();

// Inicializar o cliente
await telegramClient.initialize();

// Enviar mensagem de texto
const textMessage: Message = {
  from: 'whatsapp_group_123',
  text: 'Olá do WhatsApp!'
};

await telegramClient.sendMessage('-1001234567890', textMessage);

// Enviar imagem
const imageMessage: Message = {
  from: 'whatsapp_group_123',
  imageUrl: 'https://example.com/image.jpg'
};

await telegramClient.sendMessage('-1001234567890', imageMessage);

// Sempre parar o cliente quando terminar
await telegramClient.stop();
```

## Métodos Disponíveis

### `initialize(): Promise<void>`
Inicializa o cliente Telegram e configura o bot.

### `sendMessage(chatId: string, message: Message): Promise<void>`
Envia uma mensagem genérica que pode conter texto, imagem ou link.

### `sendText(chatId: string, text: string): Promise<void>`
Envia uma mensagem de texto simples.

### `sendImage(chatId: string, imageUrl: string, caption?: string): Promise<void>`
Envia uma imagem com legenda opcional.

### `stop(): Promise<void>`
Para o cliente e limpa os recursos.

## Tratamento de Erros

O cliente trata automaticamente os seguintes tipos de erro:

- **401 (Unauthorized)**: Token inválido
- **403 (Forbidden)**: Bot não autorizado no chat
- **429 (Too Many Requests)**: Limite de taxa excedido
- **400 (Bad Request)**: Parâmetros inválidos

## IDs de Chat do Telegram

Para obter o ID de um grupo do Telegram:

1. Adicione seu bot ao grupo
2. Envie uma mensagem no grupo
3. Acesse `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Procure pelo campo `chat.id` nas atualizações

IDs de grupo geralmente começam com `-100` (ex: `-1001234567890`).

## Testes

Execute os testes com:

```bash
yarn test
```

Os testes incluem:
- Inicialização bem-sucedida e com falha
- Envio de diferentes tipos de mensagem
- Tratamento de todos os tipos de erro
- Cenários de edge case

## Segurança

- O token do bot é carregado apenas de variáveis de ambiente
- Nunca commite tokens no código-fonte
- Use sempre HTTPS para comunicações
- Implemente rate limiting quando necessário
