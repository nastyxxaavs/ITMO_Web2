import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { Service } from '../../service/entities/service.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';
import { TeamMember } from '../../member/entities/member.entity';


export enum AuthStatus{
  AUTHORIZED = 'AUTHORIZED',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export enum Role {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: AuthStatus,
    default: AuthStatus.UNAUTHORIZED,
  })
  status: AuthStatus;


  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @ManyToOne(() => Firm, (firm) => firm.users)
  firm: Firm;

  @ManyToMany(() => Service, (service) => service.users)
  services: Service[];

  @OneToMany(() => ClientRequestEntity, (request) => request.users)
  requests: ClientRequestEntity[];

  // @OneToMany(() => TeamMember, (member) => member.)
  // requests: ClientRequestEntity[];

  login(password: string): boolean {
    if (this.password === password) { // возможно изменить на проверку юрла потом
      this.status = AuthStatus.AUTHORIZED;
      return true;
    }
    return false;
  }

  logout(): void {
    this.status = AuthStatus.UNAUTHORIZED;
  }
}