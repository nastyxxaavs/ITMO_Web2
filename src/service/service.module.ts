import { forwardRef, Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { MemberModule } from '../member/member.module';
import { TeamMember } from '../member/entities/member.entity';
import { ServiceApiController } from './service.api.controller';
import { Firm } from '../firm/entities/firm.entity';
import { FirmModule } from '../firm/firm.module';
import { FirmService } from '../firm/firm.service';
import { ServiceResolver } from './service.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([Service,TeamMember, ServiceRepository, Firm]), forwardRef(() =>MemberModule), forwardRef(() =>FirmModule)],
  controllers: [ServiceController, ServiceApiController],
  providers: [ServiceService, ServiceRepository, TeamMemberRepository, FirmService, ServiceResolver],
  exports: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
