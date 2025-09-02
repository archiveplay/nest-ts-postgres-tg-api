import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prisma: PrismaService) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User() user: JwtUserDto) {

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser) throw new NotFoundException('User not found')

    return {
      message: 'Protected user profile',
      user: dbUser,
    };
  }
}
