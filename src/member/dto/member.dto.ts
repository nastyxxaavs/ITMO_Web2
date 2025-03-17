import { Position } from '../entities/member.entity';

export class TeamMemberDto {
  id: number;
  firstName: string;
  lastName: string;
  position: Position;
  firmId?: number;
  serviceIds?: number[];
  requestId?: number;
}