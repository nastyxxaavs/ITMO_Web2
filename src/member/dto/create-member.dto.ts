import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Position } from '../entities/member.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Member name'})
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Member surname'})
  lastName: string;

  @IsEnum(Position)
  @ApiProperty({description: 'Position: \'Начальник отдела\',\n' +
      '  \'Генеральный директор\',\n' +
      '  \'Руководитель практики\',\n' +
      '  \'Помощник юриста\',\n' +
      '  \'Главный бухгалтер\',\n' +
      '  \'Ведущий юрист\',\n' +
      '  \'Младший юрист\',\n' +
      '  \'HR\''})
  position: Position;

  @IsOptional()
  @ApiProperty({description: 'Firm name'})
  firmName?: string;

}
