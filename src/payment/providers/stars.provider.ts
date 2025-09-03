import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PaymentProviderBase, PaymentCallback } from './payment-provider.base';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';

@Injectable()
export class StarsProvider extends PaymentProviderBase {
  constructor(private config: ConfigService) { super(); }

  async createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback) {
    callback && this.registerCallback(dto.payload, callback);

    const botToken = this.config.get<string>('BOT_TOKEN');

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
      {
        title: dto.title,
        description: dto.description,
        payload: dto.payload,
        provider_token: '',
        currency: 'XTR',
        prices: [{ label: dto.title, amount: dto.amount }],
      },
    );

    return { url: response.data.result };
  }
}

