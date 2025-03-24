export class FirmDto {
  id: number;
  name: string;
  description: string;
  serviceNames?: string[];
  memberNames?: string[];
  userIds?: number[];
  contactId?: number;
  requestIds?: number[];
}
