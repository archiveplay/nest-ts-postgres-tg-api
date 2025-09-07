import { Module, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StarsProvider } from './providers/stars.provider';
import { CryptoBotProvider } from './providers/cryptobot.provider';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StarsProvider,
    CryptoBotProvider,
    Logger,
  ],
  imports: [TelegramModule],
  exports: [
    PaymentService,
    StarsProvider,
    CryptoBotProvider,
  ],
})
export class PaymentModule { }

