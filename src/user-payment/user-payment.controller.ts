import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentProviderType } from 'src/payment/providers/payment-provider.enum';
import { CurrencyType } from 'src/common/types/currency.enum';
import { CreateInvoiceDto } from 'src/payment/dto/create-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('user-payment')
export class UserPaymentController {
  private readonly logger = new Logger(UserPaymentController.name);
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userPaymentService: UserPaymentService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('top-up')
  async topUpBalance(
    @Body() dto: CreateInvoiceDto,
    @User() user: JwtUserDto
  ) {
    const invoicePayload = `topup_${dto.title}_${Date.now()}`;

    await this.userPaymentService.createUserPayment(
      user.userId,
      PaymentProviderType.Stars,
      dto.amount,
      invoicePayload,
    );

    const invoice = await this.paymentService.createInvoice(
      {
        provider: PaymentProviderType.Stars,
        payload: invoicePayload,
        title: dto.title || 'Пополнение баланса',
        description: dto.description || `Пополнение баланса на ${dto.amount}`,
        amount: dto.amount,
        currency: 'XTR' as CurrencyType,
      },
      async (status, payload) => {
        await this.userPaymentService.handleTopUpCallback(status, payload, user.userId, dto.amount);
      },
    );

    this.logger.log(`Invoice ${invoice.url} successfully created for user ${user.userId}`);
    return invoice;
  }
}


