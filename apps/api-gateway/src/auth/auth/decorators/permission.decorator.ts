import { Role } from '@app/shared';
import { SetMetadata } from '@nestjs/common';
export const Permissions = (permissions: Partial<Role[]>) =>
  SetMetadata('permissions', permissions);
