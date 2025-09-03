import { Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { PaymentProviderType } from '../payment/providers/payment-provider.enum';
import { PrismaClient } from '@prisma/client';
import { PaymentCallback } from '../payment/providers/payment-provider.base';

@Injectable()
export class UserPaymentService {
  private prisma = new PrismaClient();

  constructor(private paymentService: PaymentService) { }

  async topUpBalance(userId: number, amount: number, provider: PaymentProviderType) {
    const payload = `topup_${userId}_${Date.now()}`;

    const callback: PaymentCallback = async (status, payload) => {
      if (status === 'paid') {
        await this.prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: amount } },
        });
        console.log(`User balance ${userId} increased by ${amount}`);
      } else {
        console.log(`Payment ${payload} do not success: ${status}`);
      }
    };

    return this.paymentService.createInvoice(
      {
        provider,
        title: 'Topup balance',
        description: `Topup by ${amount}`,
        payload,
        amount,
      },
      callback
    );
  }
}


