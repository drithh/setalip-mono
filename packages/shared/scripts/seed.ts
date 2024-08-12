// scripts/migrate.ts
// import 'dotenv/config';
import 'reflect-metadata';
import * as path from 'path';
import fs, { promises } from 'fs';
import { Kysely, MysqlDialect } from 'kysely';
import { pool } from '@repo/shared/db';

import { program } from '@commander-js/extra-typings';
run();

export function run() {
  program
    .command('insert')
    .argument('<seed-name>')
    .description('Run a single seed')
    .action(async (seedName) => {
      console.info('Running single seed');
      // load dynamically ts file from seeds folder
      const seedPath = path.join(__dirname, `./seeds/${seedName}.ts`);

      if (!fs.existsSync(seedPath)) {
        console.error(`Seed file not found: ${seedPath}`);
        process.exit(1);
      }

      try {
        require('esbuild-register');
        const seed = require(seedPath);
        seed.up();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });

  program
    .command('delete')
    .argument('<seed-name>')
    .description('Delete a single seed')
    .action(async (seedName) => {
      console.info('Deleting single seed');
      // load dynamically ts file from seeds folder
      const seedPath = path.join(__dirname, `./seeds/${seedName}.ts`);

      if (!fs.existsSync(seedPath)) {
        console.error(`Seed file not found: ${seedPath}`);
        process.exit(1);
      }

      try {
        require('esbuild-register');
        const seed = require(seedPath);
        seed.down();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });

  program.parseAsync();
}
