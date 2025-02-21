import { Role } from '../enums';

export interface IUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
  role: Role;
}
