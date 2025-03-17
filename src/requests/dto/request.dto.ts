import { Status } from '../entities/request.entity';

export class ClientRequestDto {
  id: number;
  clientName: string;
  contactInfo: string;
  serviceRequestedId: number;
  requestDate: Date;
  status: Status;
  firmId?: number;
  userId?: number;
  teamMemberId?: number;
}
