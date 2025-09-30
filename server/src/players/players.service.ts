import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { Database, LobbyTable } from 'src/database/database';
import CreatePlayerDto from './dto/CreatePlayerDto';
import * as randomstring from 'randomstring';
import { AUTH_TOKEN_LENGTH } from 'src/database/migrations/1_create_players';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async join(dto: CreatePlayerDto) {
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

    let lobby: {
      name: string;
      id: number;
      created_at: Date;
      code: string;
    } | null = null;
    if (dto.lobby) {
      lobby =
        (await this.db
          .selectFrom('lobbies')
          .selectAll()
          .where('code', '=', dto.lobby)
          .executeTakeFirst()) ?? null;

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
      lobby,
    };
  }

  async exit(name: string) {
    await this.db.deleteFrom('players').where('name', '=', name).execute();
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
