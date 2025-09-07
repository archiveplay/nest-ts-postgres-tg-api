import { Controller, Post, Body, Param, Logger } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { PaymentProviderType } from './providers/payment-provider.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';


@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-link')
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.paymentService.createInvoice(dto);
  }

  @Post('webhook/:provider')
  async webhook(
    @Param('provider') provider: PaymentProviderType,
    @Body() rawBody: any,
  ) {
    this.logger.log(`Webhook received for provider=${provider}`);
    return this.paymentService.handleWebhook(provider, rawBody);
  }
}

