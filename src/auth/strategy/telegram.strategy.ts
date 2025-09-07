import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import {
  validate,
  isSignatureInvalidError,
} from '@telegram-apps/init-data-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramStrategy extends PassportStrategy(
  Strategy,
  'telegram-web-app'
) {
  constructor(
    private readonly config: ConfigService
  ) {
    super();
  }

  async validate(req: any) {
    const initData = req.body.initData as string;
    if (!initData) {
      throw new UnauthorizedException(
        'initData missing'
      );
    }

    const botToken =
      this.config.get<string>('BOT_TOKEN');
    if (!botToken)
      throw new UnauthorizedException(
        'BOT_TOKEN not set'
      );

    try {
      validate(initData, botToken);
    } catch (e) {
      if (isSignatureInvalidError(e)) {
        console.error(
          '[TelegramStrategy] Signature invalid'
        );
        console.error(e);
      }
      throw new UnauthorizedException(
        'Invalid initData'
      );
    }

    const user = JSON.parse(
      decodeURIComponent(
        new URLSearchParams(initData).get('user')!
      )
    );

    return user;
  }
}
