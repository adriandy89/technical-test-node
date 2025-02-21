import { Role } from '../enums';

export interface IUser {
  id: number;
  username: string;
  phone?: string;
  name: string;
  attributes?: any;
  isActive: boolean;
  organizationId: number;
  updatedAt: Date;
  createdAt: Date;
  role: Role;
  expirationTime?: Date;
}
