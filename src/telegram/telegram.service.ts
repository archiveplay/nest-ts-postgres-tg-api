import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly api: any;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    const token = this.config.get<string>('BOT_TOKEN', '');
    this.api = axios.create({ baseURL: `https://api.telegram.org/bot${token}` });
  }

  async handleUpdate(update: any) {
    if (update.pre_checkout_query) {
      await this.answerPreCheckoutQuery(update.pre_checkout_query.id);
      return;
    }

    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment;
      const userId = update.message.from.id;
      const amount = payment.total_amount;

      await this.userService.incrementBalance(userId, amount);
      this.logger.log(`User ${userId} paid ${amount}`);
    }
  }

  async answerPreCheckoutQuery(queryId: string) {
    try {
      await this.api.post('/answerPreCheckoutQuery', { pre_checkout_query_id: queryId, ok: true });
      this.logger.log(`PreCheckoutQuery ${queryId} answered`);
    } catch (err) {
      this.logger.error(`Failed to answer pre_checkout_query: ${err}`);
    }
  }
}

