import { Module } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { UserPaymentController } from './user-payment.controller';

import { UserModule } from '@/user/user.module';
import { PaymentModule } from '@/payment/payment.module';

@Module({
  imports: [UserModule, PaymentModule],
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
})
export class UserPaymentModule {}
