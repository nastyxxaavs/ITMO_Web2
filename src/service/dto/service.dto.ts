import { Category } from '../entities/service.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty({description: 'Unique service ID'})
  id: number;
  @ApiProperty({description: 'Service name'})
  name: string;
  @ApiProperty({description: 'Description'})
  description: string;
  @ApiProperty({description: 'Service category: \'Арбитраж/третейские суды\',\n' +
      '  \'Споры с таможней\',\n' +
      '  \'Трудовые споры\',\n' +
      '  \'Контракты\',\n' +
      '  \'Локализация бизнеса\',\n' +
      '  \'Консультирование сельхозпроизводителей\''})
  category: Category;
  @ApiProperty({description: 'Service price'})
  price: number;
  @ApiProperty({description: 'Firm ID'})
  firmId?: number;
  requestId?: number;
  @ApiProperty({description: 'Members'})
  teamMemberNames?: string[];
  userIds?: number[];
}
