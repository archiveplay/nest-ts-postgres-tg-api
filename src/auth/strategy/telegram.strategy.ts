import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-telegram-web-app';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram-web-app') {
  constructor(config: ConfigService) {
    const token = config.get('BOT_TOKEN');
    if (!token) throw new Error('BOT_TOKEN is not set in env');
    super({ token });
  }

  validate(payload: any) {
    return payload;
  }
}

