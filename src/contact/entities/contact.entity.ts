import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  mapsLink: string;

  @ManyToOne(() => Firm, (firm) => firm.contacts, {nullable: true})
  firm: Firm | null;

  getContactDetails(): string {
    return `Адрес: ${this.address}\nТелефон: ${this.phone}\nEmail: ${this.email}\nСсылка на карты: ${this.mapsLink}`;
  }

  getContactDetailsObject(): object {
    return {
      address: this.address,
      phone: this.phone,
      email: this.email,
      mapsLink: this.mapsLink,
    };
  }
}
