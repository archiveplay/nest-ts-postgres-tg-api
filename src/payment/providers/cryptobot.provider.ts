import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PaymentProviderBase, PaymentCallback } from './payment-provider.base';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';

@Injectable()
export class CryptoBotProvider extends PaymentProviderBase {

  constructor(private config: ConfigService) { super() }

  async createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback) {
    callback && this.registerCallback(dto.payload, callback);

    const token = this.config.get<string>('CRYPTO_BOT_TOKEN');

    const response = await axios.post(
      'https://pay.crypt.bot/api/createInvoice',
      {
        asset: 'TON',
        amount: dto.amount,
        description: dto.description,
      },
      {
        headers: { 'Crypto-Pay-API-Token': token, 'Content-Type': 'application/json' },
      },
    );

    return { url: response.data.result.pay_url };
  }
}

