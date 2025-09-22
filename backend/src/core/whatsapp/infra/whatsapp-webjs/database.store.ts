import { type WhatsAppSessionRepositoryInterface } from '../../application/interfaces/whatsapp-session.repository';

export class DatabaseStore {
  constructor(
    private readonly repo: WhatsAppSessionRepositoryInterface,
    private readonly userId: string,
    private readonly initialSessionJson?: string | null,
  ) {}

  // RemoteAuth store API (cobertura ampla para versões):
  async sessionExists(): Promise<boolean> {
    const json = await this.get();
    return !!json;
  }

  async get(): Promise<any> {
    // Prefere inicial se fornecida; senão busca repo
    const raw = this.initialSessionJson ?? (await this.repo.getSessionJson(this.userId));
    if (!raw) return null as unknown as object;
    try {
      return JSON.parse(raw);
    } catch {
      return null as unknown as object;
    }
  }

  async set(data: unknown): Promise<void> {
    const json = JSON.stringify(data);
    await this.repo.setSessionJson(this.userId, json);
  }

  async save(data: unknown): Promise<void> {
    await this.set(data);
  }

  async update(data: unknown): Promise<void> {
    await this.set(data);
  }

  async remove(): Promise<void> {
    await this.repo.setSessionJson(this.userId, null);
  }

  async load(): Promise<any> {
    return this.get();
  }
}


