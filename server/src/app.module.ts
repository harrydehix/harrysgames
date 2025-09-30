import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PlayersModule } from './players/players.module';
import { LobbiesModule } from './lobbies/lobbies.module';
import { StadtLandVollpfostenModule } from './stadt_land_vollpfosten/stadt_land_vollpfosten.module';
import { KyselyModule } from 'nestjs-kysely';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

@Module({
  imports: [
    PlayersModule,
    LobbiesModule,
    StadtLandVollpfostenModule,
    KyselyModule.forRoot({
      dialect: new PostgresDialect({
        pool: new Pool({
          database: 'harrysgames',
          host: 'localhost',
          user: 'postgres',
          password: 'root',
          port: 5433,
          max: 10,
        }),
      }) as any,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
