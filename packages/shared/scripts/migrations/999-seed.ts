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
  Statistics,
} from '@repo/shared/db';
import { DB } from '@repo/shared/db';
import { hash } from '@node-rs/argon2';
import { SelectStatistic } from '#dep/repository/statistic';

export async function up(db: Kysely<DB>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      const class_types = await trx
        .selectFrom('class_types')
        .selectAll()
        .execute();

      const frequently_asked_questions: Insertable<FrequentlyAskedQuestions>[] =
        Array.from({
          length: 10,
        }).map((_, index) => ({
          id: index + 1,
          question: faker.lorem.sentence(),
          answer: faker.lorem.paragraph(),
        }));

      await trx
        .insertInto('frequently_asked_questions')
        .values(frequently_asked_questions)
        .execute();

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

      const packages: Insertable<Packages>[] = Array.from({ length: 3 }).map(
        (_, index) => ({
          id: index + 1,
          name: faker.commerce.productName(),
          credit: faker.number.int({ min: 1, max: 100 }),
          loyalty_points: faker.number.int({ min: 100, max: 1000 }),
          price: faker.number.int({ min: 100000, max: 1000000 }),
          one_time_only: faker.number.int({ min: 0, max: 1 }),
          valid_for: faker.number.int({ min: 30, max: 60 }),
          class_type_id: class_types[Math.floor(Math.random() * 3)]?.id ?? 1,
        })
      );

      await trx.insertInto('packages').values(packages).execute();

      const hashed_password = await hash('coba1234', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const users: Insertable<Users>[] = Array.from({ length: 10 }).map(
        (_, index) => ({
          id: index + 2,
          email: faker.internet.email(),
          hashed_password: hashed_password,
          name: faker.person.fullName(),
          phone_number: faker.phone.number(),
          address: faker.location.streetAddress(),
          role: 'user' as const,
          verified_at: faker.date.between({
            from: faker.date.past({ years: 1 }),
            to: faker.date.recent(),
          }),
          date_of_birth: faker.date.past({ years: 20 }),
          location_id:
            locations[Math.floor(Math.random() * locations.length)]?.id ?? 1,
        })
      );

      await trx.insertInto('users').values(users).execute();

      const reviews: Insertable<Reviews>[] = Array.from({ length: 10 }).map(
        (_, index) => ({
          id: index + 1,
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          rating: faker.number.int({ min: 1, max: 5 }),
          review: faker.lorem.sentence(),
        })
      );

      await trx.insertInto('reviews').values(reviews).execute();

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

      const locations_operational_hours: Insertable<LocationOperationalHours>[] =
        [];
      for (let index = 0; index < 16; index++) {
        let locationId: number, day_of_week: number;
        do {
          locationId =
            locations[Math.floor(Math.random() * locations.length)]?.id ?? 1;
          day_of_week = faker.number.int({ min: 0, max: 6 });
        } while (
          locations_operational_hours.some(
            (lo) =>
              lo.location_id === locationId && lo.day_of_week === day_of_week
          )
        );

        const openingTime =
          faker.date
            .between({ from: '2020-01-01T08:00:00', to: '2020-01-01T10:00:00' })
            .toISOString()
            .split('T')[1]
            ?.split('.')[0] ?? '08:00:00';

        const closingTime =
          faker.date
            .between({ from: '2020-01-01T18:00:00', to: '2020-01-01T20:00:00' })
            .toISOString()
            .split('T')[1]
            ?.split('.')[0] ?? '18:00:00';

        locations_operational_hours.push({
          id: index + 1,
          location_id: locationId,
          day_of_week: day_of_week,
          opening_time: openingTime,
          closing_time: closingTime,
        });
      }

      await trx
        .insertInto('location_operational_hours')
        .values(locations_operational_hours)
        .execute();

      const location_facilities: Insertable<LocationFacilities>[] = Array.from({
        length: 15,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        location_id:
          locations[Math.floor(Math.random() * locations.length)]?.id ?? 1,
        image_url: faker.image.urlPlaceholder(),
        // level: faker.number.int({ min: 1, max: 5 }),
        capacity: faker.number.int({ min: 1, max: 10 }),
      }));

      await trx
        .insertInto('location_facilities')
        .values(location_facilities)
        .execute();

      // const facility_equipments: Insertable<FacilityEquipments>[] = Array.from({
      //   length: 30,
      // }).map((_, index) => ({
      //   id: index + 1,
      //   name: faker.commerce.productName(),
      //   location_facility_id:
      //     location_facilities[Math.floor(Math.random() * 15)]?.id ?? 1,
      // }));

      // await trx
      //   .insertInto('facility_equipments')
      //   .values(facility_equipments)
      //   .execute();

      const location_assets: Insertable<LocationAssets>[] = Array.from({
        length: 15,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        location_id:
          locations[Math.floor(Math.random() * locations.length)]?.id ?? 1,
        url: faker.image.urlPlaceholder(),
      }));

      await trx.insertInto('location_assets').values(location_assets).execute();

      const clasess: Insertable<Classes>[] = Array.from({ length: 10 }).map(
        (_, index) => ({
          id: index + 1,
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          class_type_id: class_types[Math.floor(Math.random() * 3)]?.id ?? 1,
          slot: faker.number.int({ min: 1, max: 10 }),
          duration: faker.number.int({ min: 30, max: 60 }),
        })
      );

      await trx.insertInto('classes').values(clasess).execute();

      const class_locations: Insertable<ClassLocations>[] = [];
      for (let index = 0; index < 16; index++) {
        let locationId: number, classId: number;
        do {
          locationId =
            locations[Math.floor(Math.random() * locations.length)]?.id ?? 1;
          classId = clasess[Math.floor(Math.random() * 10)]?.id ?? 1;
        } while (
          class_locations.some(
            (cl) => cl.location_id === locationId && cl.class_id === classId
          )
        );

        class_locations.push({
          id: index + 1,
          class_id: classId,
          location_id: locationId,
        });
      }

      await trx.insertInto('class_locations').values(class_locations).execute();

      const class_assets: Insertable<ClassAssets>[] = Array.from({
        length: 10,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        type: 'image',
        class_id: clasess[Math.floor(Math.random() * 10)]?.id ?? 1,
        url: faker.image.urlPlaceholder(),
      }));

      await trx.insertInto('class_assets').values(class_assets).execute();

      const user_packages: Insertable<UserPackages>[] = Array.from({
        length: 30,
      }).map((_, index) => {
        const singlePackage = packages[Math.floor(Math.random() * 3)];
        return {
          id: index + 1,
          credit: faker.number.int({ min: 1, max: singlePackage?.credit ?? 1 }),
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          package_id: singlePackage?.id ?? 1,
          expired_at: faker.date.between({
            from: faker.date.past(),
            to: faker.date.future(),
          }),
        };
      });

      await trx.insertInto('user_packages').values(user_packages).execute();

      const agendas: Insertable<Agendas>[] = Array.from({ length: 30 }).map(
        (_, index) => {
          const userPackage = user_packages[Math.floor(Math.random() * 30)];
          return {
            id: index + 1,
            location_facility_id:
              location_facilities[Math.floor(Math.random() * 15)]?.id ?? 1,
            coach_id: coaches[Math.floor(Math.random() * 2)]?.id ?? 1,
            time: faker.date.between({
              from: faker.date.past(),
              to: faker.date.future(),
            }),
            class_id: clasess[Math.floor(Math.random() * 10)]?.id ?? 1,
          };
        }
      );

      await trx.insertInto('agendas').values(agendas).execute();

      const agendaBookings: Insertable<AgendaBookings>[] = Array.from({
        length: 30,
      }).map((_, index) => {
        const agenda = agendas[Math.floor(Math.random() * 30)];
        const status = ['booked', 'cancelled', 'checked_in', 'no_show'];
        const statusRandom = status[Math.floor(Math.random() * 4)] ?? 'booked';
        return {
          id: index + 1,
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          agenda_id: agenda?.id ?? 1,
          status: statusRandom as
            | 'booked'
            | 'cancelled'
            | 'checked_in'
            | 'no_show',
        };
      });

      await trx.insertInto('agenda_bookings').values(agendaBookings).execute();

      const loyaltyRewards = await trx
        .selectFrom('loyalty_rewards')
        .selectAll()
        .execute();

      const loyaltyShops: Insertable<LoyaltyShops>[] = Array.from({
        length: 10,
      }).map((_, index) => {
        return {
          id: index + 1,
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          image_url: faker.image.urlPlaceholder(),
          price: faker.number.int({ min: 10000, max: 100000 }),
        };
      });

      await trx.insertInto('loyalty_shops').values(loyaltyShops).execute();

      const creditDebitTransactions: Insertable<CreditTransactions>[] = [];
      const creditCreditTransactions: Insertable<CreditTransactions>[] = [];

      for (let userId = 1; userId <= 10; userId++) {
        for (let i = 0; i < 20; i++) {
          creditDebitTransactions.push({
            id: (userId - 1) * 50 + i + 1,
            user_id: userId,
            type: 'debit',
            amount: faker.number.int({ min: 3, max: 8 }),
            note: faker.lorem.sentence(),
            expired_at: faker.date.between({
              from: faker.date.past({ years: 1 }),
              to: faker.date.future(),
            }),
            class_type_id: class_types[Math.floor(Math.random() * 3)]?.id ?? 1,
            user_package_id:
              user_packages[Math.floor(Math.random() * 30)]?.id ?? 1,
            created_at: faker.date.between({
              from: faker.date.past({ years: 4 }),
              to: faker.date.recent(),
            }),
          });
        }
      }

      await trx
        .insertInto('credit_transactions')
        .values(creditDebitTransactions)
        .execute();

      for (let userId = 1; userId <= 10; userId++) {
        for (let i = 0; i < 100; i++) {
          const randomIndex = Math.floor(Math.random() * 50);
          creditCreditTransactions.push({
            user_id: userId,
            type: 'credit',
            amount: 1,
            note: faker.lorem.sentence(),
            class_type_id: class_types[Math.floor(Math.random() * 3)]?.id ?? 1,
            agenda_booking_id:
              agendaBookings[Math.floor(Math.random() * 30)]?.id ?? 1,
            credit_transaction_id:
              // random
              creditDebitTransactions.reduce((acc: number[], t) => {
                if (t.user_id === userId) {
                  acc.push(t.id ?? 1);
                }
                return acc;
              }, [])[randomIndex] ?? 1,
          });
        }
      }

      await trx
        .insertInto('credit_transactions')
        .values(creditCreditTransactions)
        .execute();

      const packageTransactions: Insertable<PackageTransactions>[] = Array.from(
        {
          length: 100,
        }
      ).map((_, index) => {
        const status = ['pending', 'completed', 'failed'];
        const statusRandom = status[Math.floor(Math.random() * 3)] ?? 'pending';
        const userPackage = user_packages[Math.floor(Math.random() * 30)];
        return {
          id: index + 1,
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          status: statusRandom as 'pending' | 'completed' | 'failed',
          discount: faker.number.int({ min: 1, max: 10 }),
          unique_code: faker.number.int({ min: 0, max: 1000 }),
          amount_paid: faker.number.int({ min: 100000, max: 1000000 }),
          deposit_account_id:
            deposit_accounts[Math.floor(Math.random() * 2)]?.id ?? 1,
          user_package_id: userPackage?.id ?? 1,
          package_id: userPackage?.package_id ?? 1,
          created_at: faker.date.between({
            from: faker.date.past({ years: 4 }),
            to: faker.date.recent(),
          }),
        };
      });

      await trx
        .insertInto('package_transactions')
        .values(packageTransactions)
        .execute();

      const loyaltyTransactions: Insertable<LoyaltyTransactions>[] = Array.from(
        {
          length: 100,
        }
      ).map((_, index) => {
        const isDebit = faker.number.int({ min: 0, max: 1 });
        return {
          id: index + 1,
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          type: isDebit ? ('debit' as const) : ('credit' as const),
          amount: faker.number.int({ min: 1, max: 8 }),
          note: faker.lorem.sentence(),
          loyalty_reward_id: !isDebit
            ? loyaltyRewards[Math.floor(Math.random() * 5)]?.id ?? 1
            : null,
          loyalty_shop_id: isDebit
            ? loyaltyShops[Math.floor(Math.random() * 10)]?.id ?? 1
            : null,
          created_at: faker.date.between({
            from: faker.date.past({ years: 4 }),
            to: faker.date.recent(),
          }),
        };
      });

      await trx
        .insertInto('loyalty_transactions')
        .values(loyaltyTransactions)
        .execute();

      const statistics: Insertable<Statistics>[] = Array.from({
        length: 30,
      }).map((_, index) => {
        const role: SelectStatistic['role'][] = ['coach', 'user'];
        const roleRandom = role[Math.floor(Math.random() * 2)] ?? 'user';
        return {
          id: index + 1,
          role: roleRandom,
          name: faker.person.fullName(),
          point: faker.number.int({ min: 100, max: 1000 }),
        };
      });

      await trx.insertInto('statistics').values(statistics).execute();
    });

    console.info('Migration 100-seed completed');
  } catch (error) {
    console.error('Migration 100-seed failed', error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom('statistics').execute();
      await trx.deleteFrom('reviews').execute();
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
      await trx.deleteFrom('users').where('id', '>', 1).execute();
      await trx.deleteFrom('packages').execute();
      await trx.deleteFrom('locations').execute();
      await trx.deleteFrom('deposit_accounts').execute();
    });

    console.info('Migration 100-seed reverted');
  } catch (error) {
    console.error('Migration 100-seed revert failed', error);
  }
}
