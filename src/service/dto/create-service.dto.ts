import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../entities/service.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Service name'})
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Description'})
  description: string;

  @IsEnum(Category)
  @IsNotEmpty()
  @ApiProperty({description: 'Service category: \'Арбитраж/третейские суды\',\n' +
      '  \'Споры с таможней\',\n' +
      '  \'Трудовые споры\',\n' +
      '  \'Контракты\',\n' +
      '  \'Локализация бизнеса\',\n' +
      '  \'Консультирование сельхозпроизводителей\''})
  category: Category;

  @IsNotEmpty()
  @ApiProperty({description: 'Service price'})
  price: number;
}
