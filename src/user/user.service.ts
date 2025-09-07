import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) { }

  async incrementBalance(telegramUserId: number, amount: number) {
    const result = await this.prisma.user.update({
      where: { id: telegramUserId },
      data: { balance: { increment: amount } },
    });

    this.logger.log(`User ${telegramUserId} balance increased by ${amount}`);
    return result;
  }
}

