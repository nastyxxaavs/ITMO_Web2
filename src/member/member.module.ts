import { forwardRef, Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/member.entity';
import { TeamMemberRepository } from './member.repository';
import { FirmRepository } from '../firm/firm.repository';
import { FirmModule } from '../firm/firm.module';
import { ServiceRepository } from '../service/service.repository';
import { ServiceModule } from '../service/service.module';
import { Firm } from '../firm/entities/firm.entity';
import { Service } from '../service/entities/service.entity';
import { MemberApiController } from './member.api.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember, TeamMemberRepository, Firm, Service]), forwardRef(() =>FirmModule), forwardRef(() =>ServiceModule)],
  controllers: [MemberController, MemberApiController],
  providers: [MemberService, TeamMemberRepository, FirmRepository, ServiceRepository],
  exports: [MemberService, TeamMemberRepository],
})
export class MemberModule {}
