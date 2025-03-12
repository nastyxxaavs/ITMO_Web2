import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { TeamMember } from '../../member/entities/teamMember.entity';
import { User } from '../../user/entities/user.entity';
import { Contact } from '../../contact/entities/contact.entity';
import { ClientRequestEntity } from '../../requests/entities/clientRequest.entity';

@Entity()
export class Firm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Service, (service) => service.firm)
  services: Service[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.firm)
  teamMembers: TeamMember[];

  @OneToMany(() => User, (user) => user.firm)
  users: User[];

  @OneToOne(() => Contact, (contact) => contact.firm)
  contacts: Contact;


  @OneToMany(() => ClientRequestEntity, (request) => request.firm)
  requests: ClientRequestEntity[];
}
