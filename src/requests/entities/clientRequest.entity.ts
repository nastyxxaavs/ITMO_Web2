import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { Service } from '../../service/entities/service.entity';
import { TeamMember } from '../../member/entities/teamMember.entity';
import { User } from '../../user/entities/user.entity';

export enum Status{
  'В процессе',
  'Завершен',
}

@Entity()
export class ClientRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientName: string;

  @Column()
  contactInfo: string;

  @Column({ type: 'varchar' })
  serviceRequested: Service;

  @Column()
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @ManyToOne(() => Firm, (firm) => firm.requests)
  firm: Firm;

  @ManyToOne(() => User, (user) => user.requests)
  users: User;

  @OneToOne(() => TeamMember, (teamMember) => teamMember.requests)
  teamMembers: TeamMember;

  @OneToOne(() => Service, (service) => service.requests)
  services: Service;

  updateRequestStatus(newStatus: Status): void {
    if (Object.values(Status).includes(newStatus)) {
      this.status = newStatus;
    } else {
      throw new Error('Invalid status');
    }
  }

  getRequestDetails(): string {
    return `
      Название клиента: ${this.clientName}
      Контактная информация: ${this.contactInfo}
      Услуга: ${this.serviceRequested.name}
      Дата запроса: ${this.requestDate}
      Статус запроса: ${this.status}
    `;
  }
}