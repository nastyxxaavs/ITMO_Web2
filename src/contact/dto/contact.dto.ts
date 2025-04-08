import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({description: 'Unique contact id'})
  id: number;
  @ApiProperty({description: 'Address of the contact'})
  address: string;
  @ApiProperty({description: 'Phone number'})
  phone: string;
  @ApiProperty({description: 'Email address'})
  email: string;
  @ApiProperty({description: 'Maps link'})
  mapsLink: string;
  @ApiProperty({description: 'Name of the firm'})
  firmId?: number;
}
