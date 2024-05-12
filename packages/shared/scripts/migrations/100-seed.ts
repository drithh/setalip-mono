import { CreateTableBuilder, Insertable, Kysely, sql } from 'kysely';
import { faker } from '@faker-js/faker';
import {
  ClassTypes,
  Coaches,
  Database,
  DepositAccounts,
  Locations,
  Users,
  Vouchers,
} from '@repo/shared/db';
import { DB } from '@repo/shared/db';
import { hash } from '@node-rs/argon2';

export async function up(db: Kysely<DB>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      const class_names = ['private', 'semi', 'group'];
      const class_types: Insertable<ClassTypes>[] = Array.from({
        length: 3,
      }).map((_, index) => ({
        id: index + 1,
        type: class_names[index] ?? 'private',
      }));

      await trx.insertInto('class_types').values(class_types).execute();

      const deposit_accounts: Insertable<DepositAccounts>[] = Array.from({
        length: 2,
      }).map((_, index) => ({
        id: index + 1,
        account_number: faker.finance.accountNumber(10),
        name: faker.company.name(),
        bank_name: faker.finance.accountName(),
      }));

      await trx
        .insertInto('deposit_accounts')
        .values(deposit_accounts)
        .execute();

      const locations: Insertable<Locations>[] = Array.from({
        length: 3,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.location.city(),
        address: faker.location.streetAddress(),
        phone_number: faker.phone.number(),
        email: faker.internet.email(),
        link_maps: faker.internet.url(),
      }));
      await trx.insertInto('locations').values(locations).execute();

      const hashed_password = await hash('coba1234', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const users: Insertable<Users>[] = Array.from({ length: 10 }).map(
        (_, index) => ({
          id: index + 1,
          email: faker.internet.email(),
          hashed_password: hashed_password,
          name: faker.person.fullName(),
          phone_number: faker.phone.number(),
          address: faker.location.streetAddress(),
          role: 'user' as const,
          location_id:
            locations[Math.floor(Math.random() * locations.length)]?.id ?? 1,
        })
      );

      await trx.insertInto('users').values(users).execute();

      const coaches: Insertable<Coaches>[] = Array.from({ length: 2 }).map(
        (_, index) => ({
          id: index + 1,
          user_id: users[index]?.id ?? 1,
        })
      );

      await trx.insertInto('coaches').values(coaches).execute();

      const fixed_vouchers: Insertable<Vouchers>[] = Array.from({
        length: 5,
      }).map((_, index) => ({
        id: index + 1,
        code: faker.string.alpha(10),
        discount: faker.number.int({ min: 10000, max: 200000 }),
        expired_at: faker.date.between({
          from: faker.date.past(),
          to: faker.date.future(),
        }),
        type: 'fixed' as const,
        user_id: users[Math.floor(Math.random() * users.length)]?.id ?? 1,
      }));

      const percentage_vouchers: Insertable<Vouchers>[] = Array.from({
        length: 5,
      }).map((_, index) => ({
        id: index + 6,
        code: faker.string.alpha(10),
        discount: faker.number.int({ min: 1, max: 100 }),
        expired_at: faker.date.between({
          from: faker.date.past(),
          to: faker.date.future(),
        }),
        type: 'percentage' as const,
        user_id: users[Math.floor(Math.random() * users.length)]?.id ?? 1,
      }));

      const every_one_vouchers: Insertable<Vouchers>[] = Array.from({
        length: 3,
      }).map((_, index) => ({
        id: index + 11,
        code: faker.string.alpha(10),
        discount: faker.number.int({ min: 1, max: 100 }),
        expired_at: faker.date.between({
          from: faker.date.past(),
          to: faker.date.future(),
        }),
        type: 'percentage' as const,
        user_id: null,
      }));

      await trx
        .insertInto('vouchers')
        .values([
          ...fixed_vouchers,
          ...percentage_vouchers,
          ...every_one_vouchers,
        ])
        .execute();
    });

    console.log('Migration 100-seed completed');
  } catch (error) {
    console.error('Migration 100-seed failed', error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom('locations').execute();
      await trx.deleteFrom('users').execute();
    });

    console.log('Migration 100-seed reverted');
  } catch (error) {
    console.error('Migration 100-seed revert failed', error);
  }
}
