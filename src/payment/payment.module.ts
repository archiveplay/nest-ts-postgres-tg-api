import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StarsProvider } from './providers/stars.provider';
import { CryptoBotProvider } from './providers/cryptobot.provider';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StarsProvider, CryptoBotProvider],
  exports: [PaymentService],
})
export class PaymentModule { }

