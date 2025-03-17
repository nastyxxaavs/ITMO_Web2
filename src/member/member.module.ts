import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/member.entity';
import { MemberRepository } from './member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService],
})
export class MemberModule {}
