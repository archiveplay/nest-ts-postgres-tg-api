import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { TonWalletModule } from '@/ton-wallet/ton-wallet.module';

@Module({
  imports: [TonWalletModule],
  controllers: [PayoutController],
  providers: [PayoutService],
})
export class PayoutModule {}
