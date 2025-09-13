export interface IGroupMappingService {
  // Returns target Telegram chat id for a given WhatsApp group id.
  resolveTelegramChatId(whatsappGroupId: string): Promise<string | number | null>;
}


