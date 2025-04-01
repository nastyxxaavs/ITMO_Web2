import { forwardRef, Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { MemberModule } from '../member/member.module';
import { TeamMember } from '../member/entities/member.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Service,TeamMember, ServiceRepository]), forwardRef(() =>MemberModule)],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository, TeamMemberRepository],
  exports: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
