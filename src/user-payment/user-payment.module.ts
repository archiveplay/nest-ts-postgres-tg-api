import { Module } from '@nestjs/common';
import { UserPaymentService } from './user-payment.service';
import { UserPaymentController } from './user-payment.controller';

import { UserModule } from 'src/user/user.module';
import { PaymentModule } from 'src/payment/payment.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    UserModule,
    PaymentModule,
    TelegramModule,
  ],
  controllers: [UserPaymentController],
  providers: [UserPaymentService],
})
export class UserPaymentModule { }

