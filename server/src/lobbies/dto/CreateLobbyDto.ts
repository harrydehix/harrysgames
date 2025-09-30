import { IsString } from 'class-validator';

export default class CreateLobbyDto {
  @IsString()
  name: string;
}
