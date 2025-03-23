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
