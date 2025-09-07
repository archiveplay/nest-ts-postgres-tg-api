import { Injectable, Logger } from "@nestjs/common";
import { PaymentProviderType } from "@prisma/client";
import { PaymentStatus } from "src/payment/types/PaymentStatus";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class UserPaymentService {
  private readonly logger = new Logger(UserPaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) { }

  async createUserPayment(
    userId: number,
    provider: PaymentProviderType,
    amount: number,
    payload: string,
  ) {
    await this.prisma.userPayment.create({
      data: {
        userId,
        provider,
        amount,
        payload,
        status: 'pending',
      },
    });
    this.logger.log(`UserPayment created user=${userId} payload=${payload}`);
  }

  async handleTopUpCallback(status: PaymentStatus, payload: string, userId: number, amount: number) {
    this.logger.log(`TopUp callback triggered for payload=${payload}, status=${status}`);

    const payment = await this.prisma.userPayment.update({
      where: { payload },
      data: { status },
    });

    if (status === 'paid') {
      await this.userService.incrementBalance(payment.userId, payment.amount);
      this.logger.log(`User ${userId} balance incremented by ${amount}`);
    }
  }
}


