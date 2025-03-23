import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/form.entity';
import { SubmissionRepository } from './form.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  controllers: [FormController, SubmissionRepository],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
