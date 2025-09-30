import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import CreateLobbyDto from './dto/CreateLobbyDto';
import { AdminGuard } from 'src/admin/admin.guard';

@Controller('lobbies')
export class LobbiesController {
  constructor(private lobbiesService: LobbiesService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return await this.lobbiesService.findAll();
  }

  @Get('/:code')
  async findOne(@Param('code') code: string) {
    return await this.lobbiesService.findOne(code);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body(ValidationPipe) input: CreateLobbyDto) {
    return await this.lobbiesService.create(input);
  }

  @UseGuards(AdminGuard)
  @Delete('/:code')
  async drop(@Param('code') code: string) {
    return await this.lobbiesService.delete(code);
  }
}
