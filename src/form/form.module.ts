import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/form.entity';
import { SubmissionRepository } from './form.repository';
import { FormApiController } from './form.api.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, SubmissionRepository])],
  controllers: [FormController, FormApiController],
  providers: [FormService, SubmissionRepository],
  exports: [FormService],
})
export class FormModule {}
