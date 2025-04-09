import { forwardRef, Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './contact.repository';
import { FirmRepository } from '../firm/firm.repository';
import { FirmModule } from '../firm/firm.module';
import { Firm } from '../firm/entities/firm.entity';
import { ContactApiController } from './contact.api.controller';
import { ContactResolver } from './contact.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Firm]), forwardRef(() =>FirmModule)],
  controllers: [ContactController, ContactApiController],
  providers: [ContactService, ContactRepository, FirmRepository, ContactResolver],
  exports: [ContactService, ContactRepository],
})
export class ContactModule {}
