import { Position } from '../entities/member.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TeamMemberDto {
  @ApiProperty({description: 'Unique member id'})
  id: number;
  @ApiProperty({description: 'Member name'})
  firstName: string;
  @ApiProperty({description: 'Member surname'})
  lastName: string;
  @ApiProperty({description: 'Position: \'Начальник отдела\',\n' +
      '  \'Генеральный директор\',\n' +
      '  \'Руководитель практики\',\n' +
      '  \'Помощник юриста\',\n' +
      '  \'Главный бухгалтер\',\n' +
      '  \'Ведущий юрист\',\n' +
      '  \'Младший юрист\',\n' +
      '  \'HR\''})
  position: Position;
  @ApiProperty({description: 'Firm name'})
  firmName?: string;
  serviceNames?: string[];
  requestId?: number;
  photoUrl?: string;
}