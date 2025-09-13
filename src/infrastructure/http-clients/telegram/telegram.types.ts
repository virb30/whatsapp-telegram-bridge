// Tipos específicos para Telegram
export type TelegramChatId = string | number;

export interface TelegramMessageOptions {
  parse_mode?: 'Markdown' | 'HTML' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
  reply_to_message_id?: number;
}

export interface TelegramSendMessageResult {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text?: string;
}

export interface TelegramError extends Error {
  code?: number;
  response?: {
    statusCode?: number;
    body?: string;
  };
}
