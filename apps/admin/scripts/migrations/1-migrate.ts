import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('hashed_password', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('auth_users')
    .addColumn('id', 'int8', (col) => col.primaryKey())
    .execute();

  await db.schema
    .createTable('user_sessions')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('user_id', 'int8', (col) =>
      col.notNull().references('auth_users.id')
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('auth_users').execute();
  await db.schema.dropTable('user_sessions').execute();
}
