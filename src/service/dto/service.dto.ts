import { Category } from '../entities/service.entity';

export class ServiceDto {
  id: number;
  name: string;
  description: string;
  category: Category;
  price: number;
  firmId?: number;
  requestId?: number;
  teamMemberNames?: string[];
  userIds?: number[];
}
