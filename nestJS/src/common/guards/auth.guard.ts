// ./src/guard/auth.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

export const AUTHORIZATION_HEADER_KEY = 'authorization';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseAuth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken = request.headers[AUTHORIZATION_HEADER_KEY] as
      | string
      | undefined;

    try {
      request['user'] = await this.firebaseAuth.validateUser(idToken);
      return true;
    } catch {
      throw new UnauthorizedException('認証情報が正しくありません');
    }
  }
}
