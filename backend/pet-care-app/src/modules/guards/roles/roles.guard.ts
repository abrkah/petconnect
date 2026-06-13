import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../auth/decorator/roles.decorators';
import { UserRole } from '../../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Authentication required');
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    if (
      requiredRoles.length === 1 &&
      requiredRoles[0] === UserRole.PROVIDER
    ) {
      throw new ForbiddenException(
        'This action is only available to service providers. Please sign in as a service provider.',
      );
    }

    if (requiredRoles.length === 1 && requiredRoles[0] === UserRole.OWNER) {
      throw new ForbiddenException(
        'This action is only available to pet owners. Please sign in as a pet owner.',
      );
    }

    throw new ForbiddenException('You do not have permission to access this resource.');
  }
}