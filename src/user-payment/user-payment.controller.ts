import { Controller, Post, Body } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { PaymentProviderType } from '../payment/providers/payment-provider.enum';

@Controller('user/payment')
export class UserPaymentController {
  constructor(private readonly userPaymentService: UserPaymentService) { }

  @Post('topup')
  async topUp(@Body() body: { userId: number; amount: number; provider: PaymentProviderType }) {
    return this.userPaymentService.topUpBalance(body.userId, body.amount, body.provider);
  }
}

