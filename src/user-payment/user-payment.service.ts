import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaymentProviderType } from '@prisma/client';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { CurrencyType } from 'src/common/types/currency.enum';
import { CreateInvoiceDto } from 'src/payment/dto/create-invoice.dto';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentStatus } from 'src/payment/types/PaymentStatus';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserPaymentService {
  private readonly logger = new Logger(
    UserPaymentService.name
  );
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService
  ) {}

  async createInvoice(
    user: JwtUserDto,
    invoicePayload: string,
    dto: CreateInvoiceDto
  ) {
    const invoice =
      await this.paymentService.createInvoice(
        {
          provider: dto.provider,
          payload: invoicePayload,
          title: dto.title || 'Top up balance',
          description:
            dto.description ||
            `Top up balance by ${dto.amount}`,
          amount: dto.amount,
          currency: dto.currency,
        },
        async (status) => {
          await this.handleTopUpCallback(
            invoicePayload,
            status,
            user.userId
          );
        }
      );

    return invoice;
  }

  async createUserPayment(
    userId: number,
    provider: PaymentProviderType,
    amount: number,
    currency: CurrencyType,
    payload: string
  ) {
    await this.prisma.userPayment.create({
      data: {
        userId,
        provider,
        amount,
        currency,
        payload,
        status: 'pending',
      },
    });
    this.logger.log(
      `UserPayment created user=${userId} payload=${payload}`
    );
  }

  async handleTopUpCallback(
    payload: string,
    status: PaymentStatus,
    userId: number
  ) {
    //TODO: calc amount
    const payment =
      await this.prisma.userPayment.update({
        where: { payload },
        data: { status },
      });

    if (status === 'paid') {
      await this.userService.incrementBalance(
        payment.userId,
        payment.amount
      );
      this.logger.log(
        `User ${userId} balance incremented by`
      );
    }
  }
}
