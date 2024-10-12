import { Kysely } from 'kysely';
import { sql } from 'kysely';
import { addDefaultColumns } from './001-migrate';

export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .alterTable('credit_transactions')
        .dropConstraint('credit_transactions_ibfk_5')
        .execute();
      // drop index
      await trx.schema
        .alterTable('credit_transactions')
        .dropColumn('amount')
        .dropColumn('type')
        .dropColumn('credit_transaction_id')
        .dropColumn('expired_at')
        .modifyColumn('agenda_booking_id', 'bigint', (col) => col.notNull())
        .modifyColumn('user_package_id', 'bigint', (col) => col.notNull())
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
        .alterTable('credit_transactions')
        .addColumn('amount', 'integer')
        .addColumn('expired_at', 'date')
        .addColumn('type', sql`ENUM('debit', 'credit')`, (col) => col.notNull())
        .addColumn('credit_transaction_id', 'bigint', (col) =>
          col.references('credit_transactions.id')
        )
        .execute();
    });
  } catch (error) {
    console.error(error);
  }
}
