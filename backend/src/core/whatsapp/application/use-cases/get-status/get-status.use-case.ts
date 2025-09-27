import { GetStatusInput } from "./get-status.input";
import { GetStatusOutput } from "./get-status.output";

export class GetStatusUseCase {
  constructor() {}

  async execute(input: GetStatusInput): Promise<GetStatusOutput> {
    return {
      status: 'qr',
      qrCode: 'qrCode',
    };
  }
}