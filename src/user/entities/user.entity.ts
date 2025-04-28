import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { Service } from '../../service/entities/service.entity';
import { ClientRequestEntity } from '../../requests/entities/request.entity';
import { TeamMember } from '../../member/entities/member.entity';
import { registerEnumType } from '@nestjs/graphql';


export enum AuthStatus{
  AUTHORIZED = 'AUTHORIZED',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

registerEnumType(AuthStatus, {
  name: 'AuthStatus',
});

export enum Role {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

registerEnumType(Role, {
  name: 'Role',
});

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

  @ManyToOne(() => Firm, (firm) => firm.users, {nullable: true})
  firm: Firm | null;

  @ManyToMany(() => Service, (service) => service.users)
  services: Service[];

  @OneToMany(() => ClientRequestEntity, (request) => request.users)
  requests: ClientRequestEntity[];

  @Column({ name: 'supertokensId', type: 'varchar', nullable: true, unique: true })
  supertokensId: string;

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