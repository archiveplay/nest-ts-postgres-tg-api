import { Injectable } from '@nestjs/common';
// import { TonClientProvider } from './providers/ton-client.provider';
import { CurrencyType } from '@prisma/client';

@Injectable()
export class TonWalletService {
  constructor(
  //  private readonly tonClientProvider: TonClientProvider
  ) {}

  async send(
    to: string,
    currency: CurrencyType,
    amount: number
  ) {
    if (currency === CurrencyType.TON) {
      // return await this.tonClientProvider.send(
      //   to,
      //   amount
      // );
    } else {
      console.log('currency', currency);
      return currency;
    }
  }
}
