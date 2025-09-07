import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { TelegramModule } from './telegram/telegram.module';
import { UserPaymentModule } from './user-payment/user-payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    PaymentModule,
    TelegramModule,
    UserPaymentModule,
  ],
})
export class AppModule { }
