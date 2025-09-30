import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import CreatePlayerDto from './dto/CreatePlayerDto';
import { type AuthenticatedRequest, AuthGuard } from 'src/auth/auth.guard';
import {
  AdminOptionalGuard,
  type PossibleAdminRequest,
} from 'src/admin-optional/admin-optional.guard';

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @UseGuards(AdminOptionalGuard)
  @Get()
  async findAll(@Req() req: PossibleAdminRequest) {
    return await this.playersService.findAll(req.user.isAdmin);
  }

  @Post()
  async register(@Body(ValidationPipe) input: CreatePlayerDto) {
    return await this.playersService.register(input);
  }

  @UseGuards(AuthGuard)
  @Post('lobby/:code')
  async joinLobby(
    @Param('code') code: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.playersService.joinLobby(req.user.name, code);
  }

  @UseGuards(AuthGuard)
  @Delete('lobby')
  async leaveLobby(@Req() req: AuthenticatedRequest) {
    return await this.playersService.leaveLobby(req.user.name);
  }
}
