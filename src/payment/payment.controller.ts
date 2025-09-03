import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PaymentProviderType } from './providers/payment-provider.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-link')
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.paymentService.createInvoice(dto);
  }

  @Post('webhook/:provider')
  async webhook(
    @Body('payload') payload: string,
    @Body('status') status: 'paid' | 'cancelled' | 'failed',
    @Body('provider') provider: PaymentProviderType,
  ) {
    return this.paymentService.handleWebhook(provider, payload, status);
  }
}

