export const WHATSAPP_SESSION_REPOSITORY = Symbol(
  'WHATSAPP_SESSION_REPOSITORY',
);

export interface WhatsAppSessionRepositoryInterface {
  getSessionJson(userId: string): Promise<string | null>;
  setSessionJson(userId: string, sessionJson: string | null): Promise<void>;
}
