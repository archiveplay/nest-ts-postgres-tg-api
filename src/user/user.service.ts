import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramUserDto } from 'src/auth/dto/telegram-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(
    UserService.name
  );

  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findOrCreate(dto: TelegramUserDto) {
    const user = await this.prisma.user.upsert({
      where: { id: dto.id },
      update: {
        ...dto,
        last_login: new Date(),
      },
      create: {
        ...dto,
        last_login: new Date(),
        balance: 0,
      },
    });

    return user;
  }

  async incrementBalance(
    telegramUserId: number,
    amount: number
  ) {
    const result = await this.prisma.user.update({
      where: { id: telegramUserId },
      data: { balance: { increment: amount } },
    });

    this.logger.log(
      `User ${telegramUserId} balance increased by ${amount}`
    );
    return result;
  }
}
