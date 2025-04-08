import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponse {
  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;
}
