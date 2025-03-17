import { AuthStatus, Role } from '../entities/user.entity';

export class UserDto {
  id: number;
  username: string;
  email: string;
  status: AuthStatus;
  role: Role;
  firmId?: number;
  serviceIds?: number[];
  requestIds?: number[];
}
