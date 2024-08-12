import { Kysely } from 'kysely';
import { sql } from 'kysely';
export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await sql`ALTER TABLE coaches MODIFY COLUMN user_id bigint(20) NULL`.execute(
        trx
      );

      await trx.schema
        .alterTable('packages')
        .addColumn('position', 'int8', (col) => col.defaultTo(1000))
        .execute();

      await sql`ALTER TABLE agenda_bookings MODIFY COLUMN agenda_id bigint(20) NULL`.execute(
        trx
      );

      await trx.schema
        .alterTable('agenda_bookings')
        .dropConstraint('agenda_bookings_ibfk_1')
        .execute();

      await trx.schema
        .alterTable('agenda_bookings')
        .addForeignKeyConstraint(
          'agenda_bookings_ibfk_1',
          ['agenda_id'],
          'agendas',
          ['id']
        )
        .onDelete('set null')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('coaches')
        .modifyColumn('user_id', 'bigint', (col) => col.notNull())
        .execute();

      await trx.schema.alterTable('packages').dropColumn('position').execute();

      await trx.schema
        .alterTable('agenda_bookings')
        .modifyColumn('agenda_id', 'bigint', (col) => col.notNull())
        .execute();

      await trx.schema
        .alterTable('agenda_bookings')
        .dropConstraint('agenda_bookings_ibfk_1')
        .execute();

      await trx.schema
        .alterTable('agenda_bookings')
        .addForeignKeyConstraint(
          'agenda_bookings_ibfk_1',
          ['agenda_id'],
          'agendas',
          ['id']
        )
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}
