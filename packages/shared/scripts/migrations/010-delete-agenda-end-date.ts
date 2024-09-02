import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('agendas')
        .addColumn('deleted_at', 'datetime')
        .execute();

      await trx.schema
        .alterTable('agenda_recurrences')
        .addColumn('start_date', 'date', (col) => col.notNull())
        .addColumn('end_date', 'date', (col) => col.notNull())
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema.alterTable('agendas').dropColumn('deleted_at').execute();

      await trx.schema
        .alterTable('agenda_recurrences')
        .dropColumn('start_date')
        .dropColumn('end_date')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}
