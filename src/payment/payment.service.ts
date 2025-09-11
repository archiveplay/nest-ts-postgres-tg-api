import { Injectable } from '@nestjs/common';
import { StarsProvider } from './providers/stars.provider';
import { CryptoBotProvider } from './providers/cryptobot.provider';
import { PaymentProviderType } from './providers/payment-provider.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaymentCallback } from './providers/payment-provider.base';
import { CurrencyRatesService } from 'src/currency-rates/currency-rates.service';
import { CurrencyType } from 'src/common/types/currency.enum';

@Injectable()
export class PaymentService {
  private readonly BASE_RATE = 10;

  constructor(
    private starsProvider: StarsProvider,
    private cryptoProvider: CryptoBotProvider,
    private currencyRatesService: CurrencyRatesService
  ) {}

  async createInvoice(
    dto: CreateInvoiceDto,
    callback?: PaymentCallback
  ) {
    switch (dto.provider) {
      case PaymentProviderType.Stars:
        return this.starsProvider.createInvoice(
          dto,
          callback
        );
      case PaymentProviderType.CryptoBot:
        return this.cryptoProvider.createInvoice(
          dto,
          callback
        );
      default:
        throw new Error(
          `Unknown provider: ${dto.provider}`
        );
    }
  }

  async handleWebhook(
    provider: PaymentProviderType,
    rawBody
  ) {
    switch (provider) {
      case PaymentProviderType.Stars:
        return this.starsProvider.handleWebhook(
          rawBody
        );
      case PaymentProviderType.CryptoBot:
        return this.cryptoProvider.handleWebhook(
          rawBody
        );
    }
  }

  async convertToVirtual(
    amount: number,
    currency: CurrencyType
  ) {
    const usdRate =
      await this.currencyRatesService.getUsdRate(
        currency
      );

    const amountInUsd = amount * usdRate;

    const virtualAmount =
      amountInUsd * this.BASE_RATE;

    return Math.floor(virtualAmount);
  }
}
