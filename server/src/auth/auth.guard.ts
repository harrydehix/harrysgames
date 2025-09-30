import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { Database } from 'src/database/database';

export interface AuthenticatedRequest extends Request {
  user: { name: string; isAdmin: false };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.headers['Authorization'] as string | undefined;

    const user = token
      ? await this.db
          .selectFrom('players')
          .select('name')
          .where('token', '=', token)
          .executeTakeFirst()
      : undefined;
    if (user) {
      request.user = {
        ...user,
        isAdmin: false,
      };
      return true;
    }
    return false;
  }
}
