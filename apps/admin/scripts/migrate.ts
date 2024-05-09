// scripts/migrate.ts

import * as path from 'path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from 'kysely';
import { run } from 'kysely-migration-cli';
import { db } from '@/db/database';

// For ESM environment
const migrationFolder = path.join(__dirname, './migrations');
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
});

run(db, migrator, migrationFolder);
