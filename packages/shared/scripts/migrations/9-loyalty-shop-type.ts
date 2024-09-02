import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('loyalty_shops')
        .addColumn('type', sql`ENUM('item', 'package')`, (col) => col.notNull())
        .addColumn('package_id', 'bigint', (col) =>
          col.references('packages.id').onDelete('set null')
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
        .alterTable('loyalty_shops')
        .dropColumn('type')
        .dropColumn('package_id')
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}
