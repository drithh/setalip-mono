import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('package_transactions')
        .addColumn('credit', 'int4')
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
        .alterTable('package_transactions')
        .dropColumn('credit')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}