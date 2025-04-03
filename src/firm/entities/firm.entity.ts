import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { TeamMember } from '../../member/entities/member.entity';
import { User } from '../../user/entities/user.entity';
import { Contact } from '../../contact/entities/contact.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';

@Entity()
export class Firm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Service, (service) => service.firm)
  services: Service[] | null;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.firm)
  teamMembers: TeamMember[] | null;

  @OneToMany(() => User, (user) => user.firm)
  users: User[] | null;

  @OneToMany(() => Contact, (contact) => contact.firm)
  contacts: Contact[] | null;


  @OneToMany(() => ClientRequestEntity, (request) => request.firm)
  requests: ClientRequestEntity[] | null;
}
