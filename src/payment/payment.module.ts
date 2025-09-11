import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StarsProvider } from './providers/stars.provider';
import { CryptoBotProvider } from './providers/cryptobot.provider';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PaymentController } from './payment.controller';
import { CurrencyRatesModule } from 'src/currency-rates/currency-rates.module';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    StarsProvider,
    CryptoBotProvider,
  ],
  imports: [TelegramModule, CurrencyRatesModule],
  exports: [PaymentService],
})
export class PaymentModule {}
