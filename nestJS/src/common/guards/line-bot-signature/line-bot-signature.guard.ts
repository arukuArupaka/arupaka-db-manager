/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { createHmac } from 'crypto';
import { EnvironmentsService } from 'src/config/environments.service';

@Injectable()
export class LineBotSignatureGuard implements CanActivate {
  constructor(private readonly env: EnvironmentsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RawBodyRequest<Request>>();
    const body = request.rawBody as Buffer | undefined;
    const secret = this.env.ChannelSecret;

    if (!body) return false;
    const signature = createHmac('SHA256', secret)
      .update(body)
      .digest('base64');
    const sig: string = request['headers']['x-line-signature'];
    if (!sig) return false;
    if (signature !== sig) return false;
    return true;
  }
}
