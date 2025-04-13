import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { Service } from '../../service/entities/service.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';
import { registerEnumType } from '@nestjs/graphql';
import { Role } from '../../user/entities/user.entity';

export enum Position{
  DEPARTMENT_HEAD = 'Начальник отдела',
  CEO = 'Генеральный директор',
  PRACTICE_HEAD = 'Руководитель практики',
  LEGAL_ASSISTANT = 'Помощник юриста',
  CHIEF_ACCOUNTANT = 'Главный бухгалтер',
  SENIOR_LAWYER = 'Ведущий юрист',
  JUNIOR_LAWYER = 'Младший юрист',
  HR = 'HR',
}

registerEnumType(Position, {
  name: 'Position',
});

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

  @ManyToOne(() => Firm, (firm) => firm.teamMembers, {nullable: true})
  firm: Firm | null;

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
