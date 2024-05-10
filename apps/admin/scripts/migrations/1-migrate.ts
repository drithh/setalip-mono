import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .createTable('users')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('email', 'text', (col) => col.notNull().unique())
        .addColumn('hashed_password', 'text', (col) => col.notNull())
        .execute();

      await trx.schema
        .createTable('user_sessions')
        .addColumn('id', 'varchar(50)', (col) => col.notNull().primaryKey())
        .addColumn('expires_at', 'timestamp', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .execute();
    });

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('user_sessions').execute();
}
