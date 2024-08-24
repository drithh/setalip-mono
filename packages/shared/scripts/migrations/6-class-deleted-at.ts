import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('classes')
        .addColumn('deleted_at', 'datetime')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema.alterTable('classes').dropColumn('deleted_at').execute();
    });
  } catch (error) {
    console.error(error);
  }
}
