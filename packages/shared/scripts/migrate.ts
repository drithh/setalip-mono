// scripts/migrate.ts
// import 'dotenv/config';
import 'reflect-metadata';
import * as path from 'path';
import fs, { promises } from 'fs';
import {
  MigrationResultSet,
  Migrator,
  NO_MIGRATIONS,
  FileMigrationProvider,
  Kysely,
  MysqlDialect,
} from 'kysely';
import { pool } from '@repo/shared/db';

import { program } from '@commander-js/extra-typings';

const db = new Kysely<any>({
  dialect: new MysqlDialect({
    pool: pool.pool,
  }),
  log(event) {
    if (event.level === 'query') {
      console.info(event.query.sql);
      console.info(event.query.parameters);
    }
  },
});

// For ESM environment
const migrationFolder = path.join(__dirname, './migrations');
const migrator = new Migrator({
  db: db,
  provider: new FileMigrationProvider({
    fs: promises,
    path,
    migrationFolder,
  }),
});

run(db, migrator, migrationFolder);

function showResults({ error, results }: MigrationResultSet) {
  if (results) {
    results.forEach((it) =>
      console.info(`> ${it.status}: ${it.migrationName} (${it.direction})`)
    );
    if (results.length === 0) {
      console.info('> No pending migrations to execute');
    }
  }
  if (error) {
    console.error(error);
    process.exit(1);
  }
}

export function run(
  db: Kysely<any>,
  migrator: Migrator,
  path: string = './migrations'
) {
  program
    .command('up')
    .description('Run a pending migration if any')
    .action(async () => {
      console.info('Running single migration');
      const results = await migrator.migrateUp();
      showResults(results);
    });

  program
    .command('down')
    .description('Revert the latest migration with a down file')
    .action(async () => {
      console.info('Reverting migrations');
      const results = await migrator.migrateDown();
      showResults(results);
    });

  program
    .command('redo')
    .description('Down and Up')
    .action(async () => {
      console.info('Reverting migrations');
      let results = await migrator.migrateDown();
      showResults(results);
      console.info('Running single migration');
      results = await migrator.migrateUp();
      showResults(results);
    });

  program
    .command('latest')
    .description('Run all pending migrations')
    .action(async () => {
      console.info('Running migrations');
      const results = await migrator.migrateToLatest();
      showResults(results);
    });

  program
    .command('down-to')
    .argument('<migration-name>')
    .description(
      'Migrates down to the specified migration name. Specify "NO_MIGRATIONS" to migrate all the way down.'
    )
    .action(async (name) => {
      let results: MigrationResultSet;

      if (name === 'NO_MIGRATIONS') {
        console.info(`Migrating all the way down`);
        results = await migrator.migrateTo(NO_MIGRATIONS);
      } else {
        console.info(`Migrating down to ${name}`);
        results = await migrator.migrateTo(name);
      }
      showResults(results);
    });

  program
    .command('create')
    .argument('<input-file>')
    .option('--template <template>')
    .description(
      'Create a new migration with the given description, and the current time as the version'
    )
    .action(async (name, options) => {
      const dateStr = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0];
      const fileName = `${path}/${dateStr}-${name}.ts`;
      const mkdir = () => fs.mkdirSync(path);

      let migrationTemplate = DEFAULT_TEMPLATE;

      try {
        if (options.template) {
          migrationTemplate = fs.readFileSync(options.template, 'utf8');
        }

        if (!fs.lstatSync(path).isDirectory()) {
          mkdir();
        }
      } catch {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(fileName, migrationTemplate, 'utf8');
      console.info('Created Migration:', fileName);
    });

  program.parseAsync().then(() => db.destroy());
}

const DEFAULT_TEMPLATE = `import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
`;
