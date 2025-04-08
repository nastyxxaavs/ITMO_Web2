import { AuthStatus, Role } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({description: 'Unique user ID'})
  id: number;
  @ApiProperty({description: 'User name'})
  username: string;
  @ApiProperty({description: 'User email'})
  email: string;
  @ApiProperty({description: 'User auth status: AUTHORIZED\n' +
      '  UNAUTHORIZED'})
  status: AuthStatus;
  @ApiProperty({description: 'User role: CLIENT\n' +
      '  ADMIN\n' +
      '  EMPLOYEE'})
  role: Role;
  @ApiProperty({description: 'Firm'})
  firmName?: number;
  serviceNames?: number[];
  requestIds?: number[];
}
