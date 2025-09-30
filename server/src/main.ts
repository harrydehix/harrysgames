import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import migrateToLatest from './database/migrateToLatest';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  await migrateToLatest(process.env.ENVIRONMENT === 'DEBUG');
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'HarrysGames',
      colors: true,
    }),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
