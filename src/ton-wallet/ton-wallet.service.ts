import { Injectable } from '@nestjs/common';
import { TonClientProvider } from './providers/ton-client.provider';
import { CurrencyType } from '@prisma/client';

@Injectable()
export class TonWalletService {
  constructor(
    private readonly tonClientProvider: TonClientProvider
  ) {}

  async send(
    to: string,
    currency: CurrencyType,
    amount: number
  ) {
    if (currency === CurrencyType.TON) {
      return await this.tonClientProvider.send(
        to,
        amount
      );
    } else {
      console.log('currency', currency);
      return currency;
    }
  }

  // async sendJetton(
  //   creatorWalletAddress: string,
  //   amount: number,
  //   gasAmount = 10000000
  // ): Promise<string> {
  //   const jettonMasterAddress =
  //     this.config.get<string>(
  //       'USDT_MASTER_ADDRESS'
  //     )!;
  //
  //   const payload = this.createJettonPayload(
  //     creatorWalletAddress,
  //     amount
  //   );
  //
  //   return await this.sendTon(
  //     jettonMasterAddress,
  //     gasAmount,
  //     payload
  //   );
  // }
  //
  // private createJettonPayload(
  //   to: string,
  //   amount: number
  // ): string {
  //   // Формируем payload для перевода Jetton
  //   const cell = beginCell()
  //     .storeUint(0x595f07bc, 32) // функция transfer
  //     .storeAddress(Address.parse(to))
  //     .storeCoins(BigInt(amount)) // количество токенов в минимальных единицах
  //     .storeAddress(this.appWallet.address) // response_address
  //     .storeCoins(BigInt(0)) // forward_amount
  //     .endCell();
  //
  //   return cell
  //     .toBoc({ idx: false })
  //     .toString('base64');
  // }
}
