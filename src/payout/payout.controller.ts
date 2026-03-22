import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from '@/auth/guard/jwt.guard';
import { User } from '@/common/decorators/user.decorator';
import { JwtUserDto } from '@/auth/dto/jwt-user.dto';
import { CurrencyType } from '@/common/types/currency.enum';

@Controller('payout')
export class PayoutController {
  constructor(
    private readonly payoutService: PayoutService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async send(
    @User() user: JwtUserDto,
    @Body('amount') amount: number,
    @Body('currency') currency: CurrencyType
  ) {
    const withdrawal =
      await this.payoutService.sendToCreator(
        user.userId,
        amount,
        currency
      );
    return { ok: true, withdrawal };
  }
}
