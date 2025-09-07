import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TelegramUserDto } from './dto/telegram-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async generateJwt(dto: TelegramUserDto) {
    const user =
      await this.userService.findOrCreate(dto);
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
