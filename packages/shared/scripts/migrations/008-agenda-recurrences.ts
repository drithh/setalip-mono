import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .createTable('agenda_recurrences')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('time', 'time', (col) => col.notNull())
        .addColumn('day_of_week', 'integer', (col) => col.notNull())
        .addColumn('class_id', 'bigint', (col) =>
          col.notNull().references('classes.id')
        )
        .addColumn('coach_id', 'bigint', (col) =>
          col.notNull().references('coaches.id')
        )
        .addColumn('location_facility_id', 'bigint', (col) =>
          col.notNull().references('location_facilities.id')
        )
        .execute();

      await trx.schema
        .alterTable('agendas')
        .dropColumn('weekly_recurrence')
        .dropColumn('recurrence_day')
        .addColumn('agenda_recurrence_id', 'bigint', (col) =>
          col.references('agenda_recurrences.id').onDelete('set null')
        )
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
        .alterTable('agendas')
        .dropColumn('agenda_recurrence_id')
        .addColumn('weekly_recurrence', 'boolean')
        .addColumn('recurrence_day', 'integer')
        .execute();

      await trx.schema.dropTable('agenda_recurrences').execute();
    });
  } catch (error) {
    console.error(error);
  }
}
