import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';
import { TeamMember } from '../../member/entities/member.entity';
import { User } from '../../user/entities/user.entity';

export enum Category{
  'Арбитраж/третейские суды',
  'Споры с таможней',
  'Трудовые споры',
  'Контракты',
  'Локализация бизнеса',
  'Консультирование сельхозпроизводителей',
}

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

  @ManyToOne(() => Firm, (firm) => firm.services)
  firm: Firm;

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
