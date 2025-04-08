import { ApiProperty } from '@nestjs/swagger';

export class FirmDto {
  @ApiProperty({description: 'Unique firm ID'})
  id: number;
  @ApiProperty({description: 'Firm name'})
  name: string;
  @ApiProperty({description: 'Description'})
  description: string;
  @ApiProperty({description: 'Services provided'})
  serviceNames?: string[];
  @ApiProperty({description: 'Firm members'})
  memberNames?: string[];
  userIds?: number[];
  @ApiProperty({description: 'Firm contact'})
  contactId?: number;
  requestIds?: number[];
}
