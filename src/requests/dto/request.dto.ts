import { Status } from '../entities/request.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ClientRequestDto {
  @ApiProperty({description: 'Unique request ID'})
  id: number;
  @ApiProperty({description: 'Client name'})
  clientName: string;
  @ApiProperty({description: 'Client contact'})
  contactInfo: string;
  @ApiProperty({description: 'Requested service'})
  serviceRequested: string;
  @ApiProperty({description: 'Request date'})
  requestDate: Date;
  @ApiProperty({description: 'Requested status: IN_PROGRESS or COMPLETED'})
  status: Status;
  @ApiProperty({description: 'Firm ID'})
  firmId?: number;
  userId?: number;
  teamMemberName?: string;
}
