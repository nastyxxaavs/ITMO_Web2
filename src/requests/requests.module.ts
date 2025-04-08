import { forwardRef, Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRequestEntityRepository } from './request.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { ServiceRepository } from '../service/service.repository';
import { MemberModule } from '../member/member.module';
import { ServiceModule } from '../service/service.module';
import { ClientRequestEntity } from './entities/request.entity';
import { TeamMember } from '../member/entities/member.entity';
import { Service } from '../service/entities/service.entity';
import { Firm } from '../firm/entities/firm.entity';
import { RequestsApiController } from './requests.api.controller';
import { FirmModule } from '../firm/firm.module';
import { FirmService } from '../firm/firm.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRequestEntity, ClientRequestEntityRepository, TeamMember, Service, Firm]), forwardRef(() =>MemberModule), forwardRef(() =>ServiceModule), FirmModule],
  controllers: [RequestsController, RequestsApiController],
  providers: [RequestsService, ClientRequestEntityRepository, TeamMemberRepository, ServiceRepository, FirmService],
  exports: [RequestsService, ClientRequestEntityRepository],
})
export class RequestsModule {}
