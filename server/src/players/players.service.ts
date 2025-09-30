import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { Database } from 'src/database/database';
import CreatePlayerDto from './dto/CreatePlayerDto';
import * as randomstring from 'randomstring';
import { AUTH_TOKEN_LENGTH } from 'src/database/migrations/1_create_players';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async register(dto: CreatePlayerDto) {
    if (
      await this.db
        .selectFrom('players')
        .where('name', '=', dto.name)
        .executeTakeFirst()
    ) {
      throw new HttpException('This username is already taken!', 400);
    }

    const token = randomstring.generate({
      charset: 'alphanumeric',
      length: AUTH_TOKEN_LENGTH,
    });

    if (dto.lobby) {
      const lobby = await this.db
        .selectFrom('lobbies')
        .selectAll()
        .where('code', '=', dto.lobby)
        .executeTakeFirst();

      if (!lobby) {
        throw new NotFoundException('Invalid lobby code!');
      }
    }

    await this.db
      .insertInto('players')
      .values({
        token,
        ...dto,
      })
      .execute();

    this.logger.debug(
      `Registered new player '${dto.name}' (${dto.lobby ? `joined lobby ${dto.lobby}` : `joined no lobby`})!`,
    );

    return {
      token,
    };
  }

  async joinLobby(name: string, code: string) {
    const lobby = await this.db
      .selectFrom('lobbies')
      .selectAll()
      .where('code', '=', code)
      .executeTakeFirst();

    if (!lobby) {
      throw new NotFoundException('Invalid lobby code!');
    }

    await this.db
      .updateTable('players')
      .set({
        lobby: code,
      })
      .where('name', '=', name)
      .execute();

    this.logger.debug(`Player '${name}' joined lobby '${code}'!`);
    return lobby;
  }

  async leaveLobby(name: string) {
    await this.db
      .updateTable('players')
      .set('lobby', undefined)
      .where('name', '=', name)
      .execute();

    this.logger.debug(`Player '${name}' left lobby!`);
  }

  async findAll(isAdmin: boolean) {
    const q = this.db.selectFrom('players');
    if (isAdmin) {
      return q.selectAll().execute();
    } else {
      return q.select(['created_at', 'name']).execute();
    }
  }
}
