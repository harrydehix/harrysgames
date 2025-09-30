import { Injectable, Logger } from '@nestjs/common';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { Database } from 'src/database/database';
import * as randomstring from 'randomstring';
import { LOBBY_CODE_LENGTH } from 'src/database/migrations/0_create_lobbies';
import CreateLobbyDto from './dto/CreateLobbyDto';

@Injectable()
export class LobbiesService {
  private readonly logger = new Logger(LobbiesService.name);

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findAll() {
    return await this.db.selectFrom('lobbies').selectAll().execute();
  }

  async create(dto: CreateLobbyDto) {
    const code = randomstring.generate({
      charset: 'alphabetic',
      capitalization: 'uppercase',
      length: LOBBY_CODE_LENGTH,
    });

    await this.db
      .insertInto('lobbies')
      .values({
        code,
        name: dto.name,
      })
      .execute();

    this.logger.debug(`Created lobby '${code}'!`);
    return {
      code,
    };
  }

  async delete(code: string) {
    await this.db.deleteFrom('lobbies').where('code', '=', code);
    this.logger.debug(`Deleted lobby '${code}'!`);
  }
}
