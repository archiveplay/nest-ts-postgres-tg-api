import { Injectable } from '@nestjs/common';
import { CurrencyType } from 'src/common/types/currency.enum';

@Injectable()
export class CurrencyRatesService {
  async getUsdRate(
    currency: CurrencyType
  ): Promise<number> {
    switch (currency) {
      case 'USDT':
        return 1;
      case 'TON':
        return 5.2;
      case 'XTR':
        return 0.02;
      default:
        throw new Error(
          `Unsupported currency: ${currency}`
        );
    }
  }
}
