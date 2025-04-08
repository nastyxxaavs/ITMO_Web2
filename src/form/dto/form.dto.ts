import { ApiProperty } from '@nestjs/swagger';

export class SubmissionDto {
  @ApiProperty({description: 'Unique form id'})
  id: number;
  @ApiProperty({description: 'Form name'})
  name: string;
  @ApiProperty({description: 'Email'})
  email: string;
  @ApiProperty({description: 'Submission date'})
  createdAt: Date;
}
