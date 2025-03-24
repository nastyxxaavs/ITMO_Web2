import { Status } from '../entities/request.entity';

export class ClientRequestDto {
  id: number;
  clientName: string;
  contactInfo: string;
  serviceRequested: string;
  requestDate: Date;
  status: Status;
  firmId?: number;
  userId?: number;
  teamMemberName?: string;
}
