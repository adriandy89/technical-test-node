import { IUser, Role } from '@app/shared';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Role[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user }: { user: IUser } = context.switchToHttp().getRequest();
   
    if (!user || !user.role) {
      return false;
    }
    const userRole: Role = user.role;
    return (
      requiredPermissions.includes(userRole) || userRole === Role.ADMIN
    );
  }
}
