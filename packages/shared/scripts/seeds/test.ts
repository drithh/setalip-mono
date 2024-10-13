import {
  CreateTableBuilder,
  Insertable,
  Kysely,
  MysqlDialect,
  sql,
  Transaction,
} from 'kysely';
import { faker } from '@faker-js/faker';
import {
  LoyaltyTransactions,
  LocationOperationalHours,
  ClassTypes,
  Coaches,
  Database,
  DepositAccounts,
  LocationAssets,
  LocationFacilities,
  Locations,
  Packages,
  Users,
  Vouchers,
  ClassAssets,
  ClassLocations,
  Classes,
  UserPackages,
  Agendas,
  AgendaBookings,
  LoyaltyRewards,
  LoyaltyShops,
  CreditTransactions,
  PackageTransactions,
  WebSettings,
  Reviews,
  FrequentlyAskedQuestions,
  pool,
  ReportForms,
} from '@repo/shared/db';
import { DB } from '@repo/shared/db';
import { hash } from '@node-rs/argon2';

const db = new Kysely<any>({
  dialect: new MysqlDialect({
    pool: pool.pool,
  }),
  log(event) {
    if (event.level === 'query') {
      console.info(event.query.sql);
      console.info(event.query.parameters);
    }
  },
});

const testThrow = async (trx: Transaction<any>) => {
  try {
    await trx // Ensure we await the transaction execution
      .insertInto('users')
      .values({
        id: 1,
        name: 'Cindy Tillman',
        email: 'admin@admin.com',
        password:
          '$argon2id$v=19$m=19456,t=2,p=1$OjCC4XVw7sRfq9uZGKaJEQ$PxAkR7FvZh1F8g5M8rBfZj1NVPpu5TFF4YY847bYH28',
        phone: '+6281293586210',
        date_of_birth: '2024-07-30',
        address: '214 Tobin Flats',
      })
      .executeTakeFirstOrThrow();
  } catch (error) {
    return new Error('Failed to create user');
  }
};

export async function up(): Promise<void> {
  try {
    await db
      .transaction()
      .setIsolationLevel('serializable')
      .execute(async (trx) => {
        const report_forms: Insertable<ReportForms>[] = [
          {
            input: 'text1s',
          },
        ];

        await trx
          .insertInto('report_forms')
          .values(report_forms)
          .executeTakeFirstOrThrow();
        if (await testThrow(trx)) {
          throw new Error('Failed to create user');
        }
      });

    console.info('Migration 99-default completed');
  } catch (error) {
    console.error('Migration 99-default failed', error);
  }
}

export async function down(): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom('report_forms').execute();
    });

    console.info('Migration 99-default reverted');
  } catch (error) {
    console.error('Migration 99-default revert failed', error);
  }
}
