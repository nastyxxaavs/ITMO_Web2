import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserApiController } from './user.api.controller';
import { Firm } from '../firm/entities/firm.entity';
import { FirmModule } from '../firm/firm.module';
import { FirmService } from '../firm/firm.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Firm]), FirmModule],
  controllers: [UserController, UserApiController],
  providers: [UserService, UserRepository, FirmService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
