import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('packages')
        .addColumn('discount_end_date', 'datetime')
        .addColumn('discount_percentage', 'int4', (col) => col.defaultTo(0))
        .execute();

      await trx.schema
        .alterTable('agendas')
        .addColumn('weekly_recurrence', 'boolean', (col) =>
          col.defaultTo(false)
        )
        .addColumn('recurrence_day', 'int4', (col) => col.defaultTo(0))
        .addColumn('is_show', 'boolean', (col) => col.defaultTo(true))
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
        .alterTable('packages')
        .dropColumn('discount_end_date')
        .dropColumn('discount_percentage')
        .execute();

      await trx.schema
        .alterTable('agendas')
        .dropColumn('weekly_recurrence')
        .dropColumn('recurrence_day')
        .dropColumn('is_show')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}
