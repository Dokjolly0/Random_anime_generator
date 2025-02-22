import { IsString, IsDateString, IsBoolean } from "class-validator";

export class CreateLogDTO {
  @IsString()
  ip: string;

  @IsDateString()
  date: Date;

  @IsString()
  title;

  @IsString()
  message: string;
}
