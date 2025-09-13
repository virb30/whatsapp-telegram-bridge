// Exemplo de uso do TelegramClient
// Este arquivo demonstra como usar o cliente Telegram implementado

import { TelegramClient } from './infrastructure/http-clients/telegram/telegram-client';
import { MessageDTO } from './application/dtos/message.dto';

// Exemplo de uso (comentado para evitar execução acidental)
/*
async function exampleUsage() {
  // Criar instância do cliente
  const telegramClient = new TelegramClient();

  try {
    // Inicializar o cliente
    await telegramClient.initialize();
    console.log('Telegram client initialized successfully');

    // Exemplo 1: Enviar mensagem de texto
    const textMessage: MessageDTO = {
      from: 'whatsapp_group_123',
      text: 'Olá! Esta é uma mensagem de teste da ponte WhatsApp-Telegram!'
    };

    await telegramClient.sendMessage('-1001234567890', textMessage);
    console.log('Text message sent successfully');

    // Exemplo 2: Enviar imagem
    const imageMessage: MessageDTO = {
      from: 'whatsapp_group_123',
      imageUrl: 'https://example.com/image.jpg'
    };

    await telegramClient.sendMessage('-1001234567890', imageMessage);
    console.log('Image message sent successfully');

    // Exemplo 3: Enviar imagem com legenda
    const imageWithCaption: MessageDTO = {
      from: 'whatsapp_group_123',
      text: 'Confira esta imagem incrível!',
      imageUrl: 'https://example.com/image.jpg'
    };

    await telegramClient.sendMessage('-1001234567890', imageWithCaption);
    console.log('Image with caption sent successfully');

    // Exemplo 4: Enviar link
    const linkMessage: MessageDTO = {
      from: 'whatsapp_group_123',
      link: 'https://github.com/user/whatsapp-telegram-bridge'
    };

    await telegramClient.sendMessage('-1001234567890', linkMessage);
    console.log('Link message sent successfully');

  } catch (error) {
    console.error('Error using Telegram client:', error);
  } finally {
    // Sempre parar o cliente quando terminar
    await telegramClient.stop();
  }
}

// Para executar o exemplo, descomente a linha abaixo:
// exampleUsage();
*/

console.log('WhatsApp-Telegram Bridge - TelegramClient implementation completed!');
console.log('Set TELEGRAM_BOT_TOKEN environment variable to use the client.');