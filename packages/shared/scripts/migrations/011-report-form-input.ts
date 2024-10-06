import { Kysely } from 'kysely';
import { sql } from 'kysely';
import { addDefaultColumns } from './001-migrate';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .createTable('report_forms')
        .addColumn('input', 'text')
        .$call(addDefaultColumns)
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema.dropTable('report_forms').execute();
    });
  } catch (error) {
    console.error(error);
  }
}
