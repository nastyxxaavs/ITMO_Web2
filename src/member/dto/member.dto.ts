import { Position } from '../entities/member.entity';

export class TeamMemberDto {
  id: number;
  firstName: string;
  lastName: string;
  position: Position;
  firmName?: string;
  serviceNames?: string[];
  requestId?: number;
}