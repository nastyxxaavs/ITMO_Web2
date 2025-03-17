import { Service } from '../../service/entities/service.entity';
import { TeamMember } from '../../member/entities/member.entity';
import { User } from '../../user/entities/user.entity';
import { Contact } from '../../contact/entities/contact.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';

export class FirmDto {
  id: number;
  name: string;
  description: string;
  serviceIds?: number[];
  teamMemberIds?: number[];
  userIds?: number[];
  contactId?: number;
  requestIds?: number[];
}
