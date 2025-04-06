import { forwardRef, Module } from '@nestjs/common';
import { FirmService } from './firm.service';
import { FirmController } from './firm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';
import { FirmRepository } from './firm.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { ContactRepository } from '../contact/contact.repository';
import { ServiceRepository } from '../service/service.repository';
import { ServiceModule } from '../service/service.module';
import { MemberModule } from '../member/member.module';
import { ContactModule } from '../contact/contact.module';
import { TeamMember } from '../member/entities/member.entity';
import { Contact } from '../contact/entities/contact.entity';
import { Service } from '../service/entities/service.entity';
import { FirmApiController } from './firm.api.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Firm, FirmRepository, TeamMember, Contact, Service]), ServiceModule, forwardRef(() =>MemberModule), forwardRef(() =>ContactModule)],
  controllers: [FirmController, FirmApiController],
  providers: [FirmService, FirmRepository, TeamMemberRepository,
    ContactRepository,
    ServiceRepository,],
  exports: [FirmService, FirmRepository],
})
export class FirmModule {}
