import { IsOptional, IsString } from 'class-validator';

export default class CreatePlayerDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  lobby?: string;
}
