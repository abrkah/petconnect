import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { CurrentUser } from '../types/current-user';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
