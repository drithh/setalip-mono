import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('packages')
        .addColumn('discount_credit', 'int4', (col) => col.defaultTo(0))
        .execute();

      await trx.schema
        .alterTable('statistics')
        .addColumn('description', 'text')
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
        .dropColumn('discount_credit')
        .execute();

      await trx.schema
        .alterTable('statistics')
        .dropColumn('description')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}
