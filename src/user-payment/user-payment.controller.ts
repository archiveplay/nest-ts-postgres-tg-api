import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { PaymentProviderType } from 'src/payment/providers/payment-provider.enum';
import { CreateInvoiceDto } from 'src/payment/dto/create-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { CurrencyType } from 'src/common/types/currency.enum';

@Controller('user-payment')
export class UserPaymentController {
  private readonly logger = new Logger(
    UserPaymentController.name
  );
  constructor(
    private readonly userPaymentService: UserPaymentService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('top-up')
  async topUpBalance(
    @Body() dto: CreateInvoiceDto,
    @User() user: JwtUserDto
  ) {
    const invoicePayload = `[user-payment/top-up]: ${user.userId} ${new Date()}`;

    await this.userPaymentService.createUserPayment(
      user.userId,
      PaymentProviderType.Stars,
      dto.amount,
      dto.currency || CurrencyType.USDT,
      invoicePayload
    );

    const invoice =
      await this.userPaymentService.createInvoice(
        user,
        invoicePayload,
        dto
      );

    this.logger.log(
      `Invoice ${dto.title} successfully created for user ${user.userId}`
    );
    return invoice;
  }
}
