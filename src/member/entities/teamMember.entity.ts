import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { Service } from '../../service/entities/service.entity';
import { ClientRequestEntity } from '../../requests/entities/clientRequest.entity';

export enum Position{
  'Начальник отдела',
  'Генеральный директор',
  'Руководитель практики',
  'Помощник юриста',
  'Главный бухгалтер',
  'Ведущий юрист',
  'Младший юрист',
  'HR',
}

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Position,
  })
  position: Position;

  @ManyToOne(() => Firm, (firm) => firm.teamMembers)
  firm: Firm;

  @ManyToMany(() => Service, (service) => service.teamMembers)
  services: Service[];

  @OneToOne(() => ClientRequestEntity, (request) => request.teamMembers)
  requests: ClientRequestEntity;

  getMemberDetails(): string {
    return `Имя: ${this.firstName}\nФамилия: ${this.lastName}\nДолжность: ${this.position}`;
  }

  getMemberDetailsObject(): object {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      position: this.position,
    };
  }
}
