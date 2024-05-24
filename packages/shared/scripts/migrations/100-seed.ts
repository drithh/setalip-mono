import { LoyaltyTransactions } from './../../src/db/schema';
import { CreateTableBuilder, Insertable, Kysely, sql } from 'kysely';
import { faker } from '@faker-js/faker';
import {
  ClassTypes,
  Coaches,
  Database,
  DepositAccounts,
  FacilityEquipments,
  LocationAssets,
  LocationFacilities,
  LocationOpeningHours,
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

      const locations_opening_hours: Insertable<LocationOpeningHours>[] = [];
      for (let index = 0; index < 16; index++) {
        let locationId: number, day_of_week: number;
        do {
          locationId =
            locations[Math.floor(Math.random() * locations.length)]?.id ?? 1;
          day_of_week = faker.number.int({ min: 0, max: 6 });
        } while (
          locations_opening_hours.some(
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

        // console.log(openingTime, closingTime);
        locations_opening_hours.push({
          id: index + 1,
          location_id: locationId,
          day_of_week: day_of_week,
          opening_time: openingTime,
          closing_time: closingTime,
        });
      }

      await trx
        .insertInto('location_opening_hours')
        .values(locations_opening_hours)
        .execute();

      const location_facilities: Insertable<LocationFacilities>[] = Array.from({
        length: 15,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        location_id:
          locations[Math.floor(Math.random() * locations.length)]?.id ?? 1,
        image_url: faker.image.urlPlaceholder(),
        level: faker.number.int({ min: 1, max: 5 }),
        capacity: faker.number.int({ min: 1, max: 10 }),
      }));

      await trx
        .insertInto('location_facilities')
        .values(location_facilities)
        .execute();

      const facility_equipments: Insertable<FacilityEquipments>[] = Array.from({
        length: 30,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        location_facility_id:
          location_facilities[Math.floor(Math.random() * 15)]?.id ?? 1,
      }));

      await trx
        .insertInto('facility_equipments')
        .values(facility_equipments)
        .execute();

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
            slot: faker.number.int({ min: 1, max: 10 }),
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

      const loyaltyRewards: Insertable<LoyaltyRewards>[] = Array.from({
        length: 10,
      }).map((_, index) => ({
        id: index + 1,
        name: faker.commerce.productName(),
        credit: faker.number.int({ min: 1, max: 10 }),
        description: faker.lorem.sentence(),
      }));

      await trx.insertInto('loyalty_rewards').values(loyaltyRewards).execute();

      const loyaltyShops: Insertable<LoyaltyShops>[] = Array.from({
        length: 10,
      }).map((_, index) => {
        const isPurchasable = faker.number.int({ min: 0, max: 1 });
        return {
          id: index + 1,
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          image_url: faker.image.urlPlaceholder(),
          price: isPurchasable
            ? faker.number.int({ min: 10000, max: 100000 })
            : null,
          purchasable: isPurchasable,
        };
      });

      await trx.insertInto('loyalty_shops').values(loyaltyShops).execute();
      console.log('creditTransactions');
      const creditTransactions: Insertable<CreditTransactions>[] = Array.from({
        length: 100,
      }).map((_, index) => {
        const isDebit = faker.number.int({ min: 0, max: 1 });

        return {
          id: index + 1,
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          type: isDebit ? ('debit' as const) : ('credit' as const),
          amount: faker.number.int({ min: 1, max: 8 }),
          note: faker.lorem.sentence(),
          expired_at: isDebit
            ? null
            : faker.date.between({
                from: faker.date.past(),
                to: faker.date.future(),
              }),
          class_type_id: class_types[Math.floor(Math.random() * 3)]?.id ?? 1,
          agenda_booking_id: !isDebit
            ? agendaBookings[Math.floor(Math.random() * 30)]?.id ?? 1
            : null,
          user_package_id: isDebit
            ? user_packages[Math.floor(Math.random() * 30)]?.id ?? 1
            : null,
          created_at: faker.date.between({
            from: faker.date.past({ years: 4 }),
            to: faker.date.recent(),
          }),
        };
      });

      await trx
        .insertInto('credit_transactions')
        .values(creditTransactions)
        .execute();

      const packageTransactions: Insertable<PackageTransactions>[] = Array.from(
        {
          length: 100,
        }
      ).map((_, index) => {
        const status = ['pending', 'completed', 'failed'];
        const statusRandom = status[Math.floor(Math.random() * 3)] ?? 'pending';

        return {
          id: index + 1,
          user_id: users[Math.floor(Math.random() * 10)]?.id ?? 1,
          status: statusRandom as 'pending' | 'completed' | 'failed',
          discount: faker.number.int({ min: 1, max: 10 }),
          unique_code: faker.number.int({ min: 0, max: 1000 }),
          amount: faker.number.int({ min: 1, max: 8 }),
          deposit_account_id:
            deposit_accounts[Math.floor(Math.random() * 2)]?.id ?? 1,
          user_package_id:
            user_packages[Math.floor(Math.random() * 30)]?.id ?? 1,
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
            ? loyaltyRewards[Math.floor(Math.random() * 10)]?.id ?? 1
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
    });

    console.log('Migration 100-seed completed');
  } catch (error) {
    console.error('Migration 100-seed failed', error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom('loyalty_transactions').execute();
      await trx.deleteFrom('package_transactions').execute();
      await trx.deleteFrom('credit_transactions').execute();
      await trx.deleteFrom('user_packages').execute();
      await trx.deleteFrom('agenda_bookings').execute();
      await trx.deleteFrom('agendas').execute();
      await trx.deleteFrom('loyalty_shops').execute();
      await trx.deleteFrom('loyalty_rewards').execute();
      await trx.deleteFrom('class_assets').execute();
      await trx.deleteFrom('class_locations').execute();
      await trx.deleteFrom('classes').execute();
      await trx.deleteFrom('facility_equipments').execute();
      await trx.deleteFrom('location_assets').execute();
      await trx.deleteFrom('location_facilities').execute();
      await trx.deleteFrom('location_opening_hours').execute();
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

    console.log('Migration 100-seed reverted');
  } catch (error) {
    console.error('Migration 100-seed revert failed', error);
  }
}
