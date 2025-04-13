import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';
import { Position, TeamMember } from '../../member/entities/member.entity';
import { User } from '../../user/entities/user.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum Category{
  ARBITRATION = 'Арбитраж/третейские суды',
  CUSTOMS_DISPUTES = 'Споры с таможней',
  LABOR_DISPUTES = 'Трудовые споры',
  CONTRACTS = 'Контракты',
  BUSINESS_LOCALIZATION = 'Локализация бизнеса',
  AGRICULTURE_CONSULTING = 'Консультирование сельхозпроизводителей',
}


registerEnumType(Category, {
  name: 'Category',
});


@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Category,
  })
  category: Category;

  @Column()
  price: number;

  @ManyToOne(() => Firm, (firm) => firm.services, {nullable: true})
  firm: Firm | null;

  @OneToOne(() => ClientRequestEntity, (request) => request.services)
  requests: ClientRequestEntity;

  @ManyToMany(() => TeamMember, (teamMember) => teamMember.services)
  teamMembers: TeamMember[];

  @ManyToMany(() => User, (user) => user.services)
  users: User[];

  getServiceDetails(): string {
    return `Название услуги: ${this.name}\nОписание услуги: ${this.description}\nКатегория: ${this.category}\nСтоимость: ${this.price}`;
  }

  getServiceDetailsObject(): object {
    return {
      name: this.name,
      description: this.description,
      category: this.category,
      price: this.price,
    };
  }
}
