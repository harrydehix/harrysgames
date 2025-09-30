import { IsOptional, IsString, MinLength } from 'class-validator';

export default class CreatePlayerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  lobby?: string;
}
