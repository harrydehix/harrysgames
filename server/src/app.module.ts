import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PlayersModule } from './players/players.module';
import { LobbiesModule } from './lobbies/lobbies.module';
import { StadtLandVollpfostenModule } from './stadt_land_vollpfosten/stadt_land_vollpfosten.module';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { postgresDialect } from './database/database';

@Module({
  imports: [
    PlayersModule,
    LobbiesModule,
    StadtLandVollpfostenModule,
    KyselyModule.forRoot({
      dialect: postgresDialect() as any,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
