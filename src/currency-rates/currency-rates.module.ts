import { Module } from '@nestjs/common';
import { CurrencyRatesService } from './currency-rates.service';

@Module({
  providers: [CurrencyRatesService],
  exports: [CurrencyRatesService],
})
export class CurrencyRatesModule {}
