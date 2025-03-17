import { IsString } from "class-validator";

export class CreateFirmDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
