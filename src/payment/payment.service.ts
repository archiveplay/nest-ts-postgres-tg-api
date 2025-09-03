import { Injectable } from '@nestjs/common';
import { StarsProvider } from './providers/stars.provider';
import { CryptoBotProvider } from './providers/cryptobot.provider';
import { PaymentProviderType } from './providers/payment-provider.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class PaymentService {
  constructor(
    private starsProvider: StarsProvider,
    private cryptoProvider: CryptoBotProvider,
  ) { }

  async createInvoice(dto: CreateInvoiceDto, callback?: any) {
    switch (dto.provider) {
      case PaymentProviderType.Stars:
        return this.starsProvider.createInvoice(dto, callback);
      case PaymentProviderType.CryptoBot:
        return this.cryptoProvider.createInvoice(dto, callback);
      default:
        throw new Error(`Unknown provider: ${dto.provider}`);
    }
  }

  async handleWebhook(provider: PaymentProviderType, payload: string, status: 'paid' | 'cancelled' | 'failed') {
    switch (provider) {
      case PaymentProviderType.Stars:
        return this.starsProvider.handlePayment(payload, status);
      case PaymentProviderType.CryptoBot:
        return this.cryptoProvider.handlePayment(payload, status);
    }
  }
}


