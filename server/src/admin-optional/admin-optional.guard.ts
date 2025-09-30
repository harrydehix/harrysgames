import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

export interface PossibleAdminRequest extends Request {
  user: { isAdmin: boolean };
}

@Injectable()
export class AdminOptionalGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<PossibleAdminRequest>();

    const password = request.headers['x-admin-key'] as string | undefined;

    if (password === process.env.ADMIN_API_KEY) {
      request.user = {
        isAdmin: true,
      };
    } else {
      request.user = {
        isAdmin: false,
      };
    }

    return true;
  }
}
