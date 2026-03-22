import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaymentProviderType } from '@prisma/client';
import { JwtUserDto } from '@/auth/dto/jwt-user.dto';
import { CurrencyType } from '@/common/types/currency.enum';
import { CreateInvoiceDto } from '@/payment/dto/create-invoice.dto';
import { PaymentService } from '@/payment/payment.service';
import { ParsedPaymentPayload } from '@/payment/providers/payment-provider.base';
import { PaymentStatus } from '@/payment/types/PaymentStatus';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

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
    const { id } =
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
      `UserPayment ${id} created user=${userId} payload=${payload}`
    );
    return id;
  }

  async handleTopUpCallback(
    invoicePayload: string,
    status: PaymentStatus,
    userId: number
  ) {
    if (status === 'paid') {
      const payment =
        await this.prisma.userPayment.update({
          where: { payload: invoicePayload },
          data: { status },
        });

      await this.userService.incrementBalance(
        payment.userId,
        payment.amount,
        payment.currency
      );

      this.logger.log(
        `User ${userId} balance incremented by ${payment.amount} ${payment.currency})`
      );
    }
  }

  async getPaymentById(id: number) {
    return this.prisma.userPayment.findUnique({
      where: { id },
    });
  }
}
