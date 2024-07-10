import { CreateTableBuilder, Insertable, Kysely, sql } from 'kysely';
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
} from '@repo/shared/db';
import { DB } from '@repo/shared/db';
import { hash } from '@node-rs/argon2';

export async function up(db: Kysely<DB>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      const class_names = ['Private', 'Semi', 'Group'];
      const class_types: Insertable<ClassTypes>[] = Array.from({
        length: 3,
      }).map((_, index) => ({
        id: index + 1,
        type: class_names[index] ?? 'private',
      }));

      await trx.insertInto('class_types').values(class_types).execute();

      const web_settings: Insertable<WebSettings>[] = [
        {
          key: 'terms_and_conditions',
          value: faker.lorem.paragraph(),
        },
        {
          key: 'privacy_policy',
          value: faker.lorem.paragraph(),
        },
        {
          key: 'instagram_handle',
          value: faker.internet.userName(),
        },
        {
          key: 'tiktok_handle',
          value: faker.internet.userName(),
        },
        {
          key: 'logo',
          value: 'http://localhost:3000/uploads/logo.webp',
        },
      ];

      await trx.insertInto('web_settings').values(web_settings).execute();

      const hashed_password = await hash('coba1234', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const users: Insertable<Users>[] = Array.from({ length: 1 }).map(
        (_, index) => ({
          id: index + 1,
          email: 'admin@admin.com',
          hashed_password: hashed_password,
          name: faker.person.fullName(),
          phone_number: faker.phone.number(),
          address: faker.location.streetAddress(),
          role: 'admin' as const,
          date_of_birth: faker.date.past(),
          verified_at: faker.date.between({
            from: faker.date.past(),
            to: faker.date.recent(),
          }),
          location_id: null,
        })
      );

      await trx.insertInto('users').values(users).execute();
      1;
      2;
      3;
      4;
      5;

      const loyalty_rewards = [
        {
          name: 'Class Attendance',
          description: 'Earn 5 points for each class attended.',
          credit: 5,
        },
        {
          name: 'Referrals',
          description:
            'Earn 50 points for each new member referred who buy membership.',
          credit: 50,
        },
        {
          name: 'Reviews/Feedback',
          description:
            'Earn 20 points for leaving a review or providing feedback on our website.',
          credit: 20,
        },
        {
          name: 'Birthday Gift',
          description: 'Receive 150 points as a birthday gift each year.',
          credit: 150,
        },
        {
          name: 'Membership Renewal',
          description: 'Earn 100 points upon renewing membership.',
          credit: 100,
        },
      ] satisfies Insertable<LoyaltyRewards>[];

      await trx.insertInto('loyalty_rewards').values(loyalty_rewards).execute();
    });

    console.info('Migration 99-default completed');
  } catch (error) {
    console.error('Migration 99-default failed', error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom('loyalty_transactions').execute();
      await trx.deleteFrom('package_transactions').execute();
      await trx
        .deleteFrom('credit_transactions')
        .where('type', '=', 'credit')
        .execute();
      await trx
        .deleteFrom('credit_transactions')
        .where('type', '=', 'debit')
        .execute();
      await trx.deleteFrom('user_packages').execute();
      await trx.deleteFrom('agenda_bookings').execute();
      await trx.deleteFrom('agendas').execute();
      await trx.deleteFrom('loyalty_shops').execute();
      await trx.deleteFrom('loyalty_rewards').execute();
      await trx.deleteFrom('class_assets').execute();
      await trx.deleteFrom('class_locations').execute();
      await trx.deleteFrom('classes').execute();
      // await trx.deleteFrom('facility_equipments').execute();
      await trx.deleteFrom('location_assets').execute();
      await trx.deleteFrom('location_facilities').execute();
      await trx.deleteFrom('location_operational_hours').execute();
      await trx.deleteFrom('vouchers').execute();

      await trx.deleteFrom('user_sessions').execute();
      await trx.deleteFrom('reset_password').execute();

      await trx.deleteFrom('coaches').execute();
      await trx.deleteFrom('users').execute();
      await trx.deleteFrom('packages').execute();
      await trx.deleteFrom('locations').execute();
      await trx.deleteFrom('deposit_accounts').execute();
      await trx.deleteFrom('class_types').execute();
    });

    console.info('Migration 99-default reverted');
  } catch (error) {
    console.error('Migration 99-default revert failed', error);
  }
}
