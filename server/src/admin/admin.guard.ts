import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface AdminRequest extends Request {
  user: { isAdmin: true };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const password = request.headers['x-admin-key'] as string | undefined;

    if (password === process.env.ADMIN_API_KEY) {
      request.user = {
        isAdmin: true,
      };
      return true;
    }
    return false;
  }
}
