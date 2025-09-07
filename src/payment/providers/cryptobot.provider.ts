import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  PaymentProviderBase,
  PaymentCallback,
} from './payment-provider.base';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { PaymentStatus } from '../types/PaymentStatus';

@Injectable()
export class CryptoBotProvider extends PaymentProviderBase {
  constructor(
    private readonly config: ConfigService
  ) {
    super();
  }

  async createInvoice(
    dto: CreateInvoiceDto,
    callback?: PaymentCallback
  ) {
    this.registerCallback(dto.payload, callback);

    const token = this.config.get<string>(
      'TG_CRYPTOBOT_PROVIDER_TOKEN'
    );

    const response = await axios.post(
      'https://pay.crypt.bot/api/createInvoice',
      {
        asset: 'TON',
        amount: dto.amount,
        description: dto.description,
      },
      {
        headers: {
          'Crypto-Pay-API-Token': token,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      url: response.data.result.pay_url as string,
    };
  }

  protected parseWebhook(rawBody: any) {
    //TODO: parse для cryptobot
    return {
      status: 'paid' as PaymentStatus,
      payload: 'epta',
    };
  }
}
