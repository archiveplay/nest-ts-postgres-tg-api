import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramUserDto } from './dto/telegram-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) { }

  async generateJwt(userDto: TelegramUserDto) {

    const user = await this.prisma.user.upsert({
      where: { id: userDto.id },
      update: {
        ...userDto,
        last_login: new Date(),
      },
      create: {
        ...userDto,
        last_login: new Date(),
      },
    });

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
      user
    }
  }
}
