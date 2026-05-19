import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.get<string>('jwt.secret'),
    } as any);
  }

  async validate(payload: any): Promise<AuthUser> {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
