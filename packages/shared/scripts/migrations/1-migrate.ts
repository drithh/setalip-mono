import { CreateTableBuilder, Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const addDefaultColumns = <T extends string, C extends string = never>(
    builder: CreateTableBuilder<T, C>
  ) => {
    return builder
      .addColumn('created_at', 'date', (col) =>
        col.notNull().defaultTo(sql`now()`)
      )
      .addColumn('updated_at', 'date', (col) =>
        col.notNull().defaultTo(sql`now()`)
      )
      .addColumn('updated_by', 'bigint', (col) =>
        col.notNull().defaultTo(sql`0`)
      );
  };
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema
        .createTable('locations')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('email', 'text', (col) => col.notNull().unique())
        .addColumn('phone_number', 'text', (col) => col.notNull().unique())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('address', 'text', (col) => col.notNull())
        .addColumn('link_maps', 'text', (col) => col.notNull())
        .addColumn('deleted_at', 'timestamp')
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('users')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('email', 'text', (col) => col.notNull().unique())
        .addColumn('hashed_password', 'text', (col) => col.notNull())
        .addColumn('phone_number', 'text', (col) => col.notNull().unique())
        .addColumn('address', 'text', (col) => col.notNull())
        .addColumn(
          'role',
          sql`ENUM('admin', 'user', 'coach', 'owner')`,
          (col) => col.notNull()
        )
        .addColumn('location_id', 'bigint', (col) =>
          col.notNull().references('locations.id')
        )
        .addColumn('verified_at', 'timestamp')
        .$call(addDefaultColumns)
        .execute();

      // create index
      await trx.schema
        .createIndex('users_phone_number_index')
        .on('users')
        .column('phone_number')
        .execute();

      await trx.schema
        .createTable('otp')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('otp', 'text', (col) => col.notNull())
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id').unique()
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('user_sessions')
        .addColumn('id', 'varchar(50)', (col) => col.notNull().primaryKey())
        .addColumn('expires_at', 'timestamp', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('reset_password')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('token', 'text', (col) => col.notNull().unique())
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('coaches')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('location_operational_hours')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('day_of_week', 'int4', (col) => col.notNull())
        .addColumn('opening_time', 'time', (col) => col.notNull())
        .addColumn('closing_time', 'time', (col) => col.notNull())
        .addColumn('location_id', 'bigint', (col) =>
          col.notNull().references('locations.id')
        )
        .addCheckConstraint(
          'opening_time_before_closing_time',
          sql`opening_time <= closing_time`
        )
        .addCheckConstraint(
          'day_of_week_range',
          sql`day_of_week >= 0 AND day_of_week <= 6`
        )
        .addUniqueConstraint('location_day_of_week', [
          'location_id',
          'day_of_week',
        ])
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('location_facilities')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('capacity', 'int4', (col) => col.notNull())
        .addColumn('level', 'int4', (col) => col.notNull())
        .addColumn('image_url', 'text')
        .addColumn('location_id', 'bigint', (col) =>
          col.notNull().references('locations.id')
        )
        .addColumn('deleted_at', 'timestamp')
        .$call(addDefaultColumns)
        .execute();

      // await trx.schema
      //   .createTable('facility_equipments')
      //   .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
      //   .addColumn('name', 'text', (col) => col.notNull())
      //   .addColumn('location_facility_id', 'bigint', (col) =>
      //     col.notNull().references('location_facilities.id').onDelete('cascade')
      //   )
      //   .$call(addDefaultColumns)
      //   .execute();

      await trx.schema
        .createTable('location_assets')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('url', 'text', (col) => col.notNull())
        .addColumn('location_id', 'bigint', (col) =>
          col.notNull().references('locations.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('class_types')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('type', 'text', (col) => col.notNull())
        .execute();

      await trx.schema
        .createTable('packages')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('credit', 'int4', (col) => col.notNull())
        .addColumn('price', 'int4', (col) => col.notNull().unsigned())
        .addColumn('valid_for', 'int4', (col) => col.notNull())
        .addColumn('one_time_only', 'boolean', (col) => col.notNull())
        .addColumn('loyalty_points', 'int4', (col) => col.notNull())
        .addColumn('class_type_id', 'bigint', (col) =>
          col.notNull().references('class_types.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('vouchers')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('code', 'text', (col) => col.notNull().unique())
        .addColumn('type', sql`ENUM('percentage', 'fixed')`, (col) =>
          col.notNull()
        )
        .addColumn('discount', 'int4', (col) => col.notNull())
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) => col.references('users.id'))
        .addCheckConstraint(
          'discount_percentage_max',
          sql`type = 'percentage' AND discount <= 100 OR type = 'fixed'`
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('user_packages')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('credit', 'int4', (col) => col.notNull())
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('class_type_id', 'bigint', (col) =>
          col.references('class_types.id')
        )
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('package_id', 'bigint', (col) =>
          col.notNull().references('packages.id')
        )
        .addColumn('voucher_id', 'bigint', (col) =>
          col.references('vouchers.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('deposit_accounts')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('account_number', 'text', (col) => col.notNull())
        .addColumn('bank_name', 'text', (col) => col.notNull())
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('package_transactions')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('amount', 'int4', (col) => col.notNull().unsigned())
        .addColumn('unique_code', 'int4', (col) => col.unsigned())
        .addColumn('discount', 'int4', (col) => col.unsigned())
        .addColumn(
          'status',
          sql`ENUM('pending', 'completed', 'failed')`,
          (col) => col.notNull()
        )
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('user_package_id', 'bigint', (col) =>
          col.references('user_packages.id')
        )
        .addColumn('deposit_account_id', 'bigint', (col) =>
          col.references('deposit_accounts.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('classes')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('duration', 'int4', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('class_type_id', 'bigint', (col) =>
          col.notNull().references('class_types.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('class_locations')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('class_id', 'bigint', (col) =>
          col.notNull().references('classes.id')
        )
        .addColumn('location_id', 'bigint', (col) =>
          col.notNull().references('locations.id')
        )
        .addUniqueConstraint('class_location_unique', [
          'class_id',
          'location_id',
        ])
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('class_assets')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('url', 'text', (col) => col.notNull())
        .addColumn('type', 'text', (col) => col.notNull())
        .addColumn('class_id', 'bigint', (col) =>
          col.notNull().references('classes.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('agendas')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('time', 'timestamp', (col) => col.notNull())
        .addColumn('slot', 'int4', (col) => col.notNull())
        .addColumn('class_id', 'bigint', (col) =>
          col.notNull().references('classes.id')
        )
        .addColumn('coach_id', 'bigint', (col) =>
          col.notNull().references('coaches.id')
        )
        .addColumn('location_facility_id', 'bigint', (col) =>
          col.notNull().references('location_facilities.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('agenda_bookings')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn(
          'status',
          sql`ENUM('booked', 'checked_in', 'cancelled', 'no_show')`,
          (col) => col.notNull()
        )
        .addColumn('agenda_id', 'bigint', (col) =>
          col.notNull().references('agendas.id')
        )
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('credit_transactions')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('type', sql`ENUM('debit', 'credit')`, (col) => col.notNull())
        .addColumn('amount', 'int4', (col) => col.notNull())
        .addColumn('expired_at', 'timestamp')
        .addColumn('note', 'text', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('class_type_id', 'bigint', (col) =>
          col.notNull().references('class_types.id')
        )
        .addColumn('agenda_booking_id', 'bigint', (col) =>
          col.references('agenda_bookings.id')
        )
        .addColumn('user_package_id', 'bigint', (col) =>
          col.references('user_packages.id')
        )
        .addCheckConstraint(
          'credit_transaction_only_one_reference',
          sql`agenda_booking_id IS NOT NULL AND user_package_id IS NULL OR agenda_booking_id IS NULL AND user_package_id IS NOT NULL`
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('loyalty_rewards')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('credit', 'int4', (col) => col.notNull().unsigned())
        .execute();

      await trx.schema
        .createTable('loyalty_shops')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('purchasable', 'boolean', (col) => col.notNull())
        .addColumn('price', 'int4', (col) => col.unsigned())
        .addColumn('image_url', 'text')
        .addCheckConstraint(
          'loyalty_unpurchasable_item',
          sql`purchasable = false AND price IS NULL OR purchasable = true AND price IS NOT NULL`
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('loyalty_transactions')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('type', sql`ENUM('debit', 'credit')`, (col) => col.notNull())
        .addColumn('amount', 'int4', (col) => col.notNull())
        .addColumn('note', 'text', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('loyalty_reward_id', 'bigint', (col) =>
          col.references('loyalty_rewards.id')
        )
        .addColumn('loyalty_shop_id', 'bigint', (col) =>
          col.references('loyalty_shops.id')
        )
        .$call(addDefaultColumns)
        .execute();

      // await trx.schema
      //   .createTable('flash_sales')
      //   .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
      //   .addColumn('name', 'text', (col) => col.notNull())
      //   .addColumn('description', 'text', (col) => col.notNull())
      //   .addColumn('discount', 'int4', (col) => col.notNull())
      //   .addColumn('type', sql`ENUM('percentage', 'fixed')`, (col) =>
      //     col.notNull()
      //   )
      //   .addCheckConstraint(
      //     'discount_percentage_max',
      //     sql`type = 'percentage' AND discount <= 100`
      //   )
      //   .addColumn('expired_at', 'timestamp', (col) => col.notNull());
    });

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  try {
    await db.transaction().execute(async (trx) => {
      await trx.schema.dropTable('flash_sales').ifExists().execute();
      await trx.schema.dropTable('loyalty_transactions').ifExists().execute();
      await trx.schema.dropTable('package_transactions').ifExists().execute();
      await trx.schema.dropTable('credit_transactions').ifExists().execute();

      await trx.schema.dropTable('loyalty_shops').ifExists().execute();
      await trx.schema.dropTable('loyalty_rewards').ifExists().execute();

      await trx.schema.dropTable('agenda_bookings').ifExists().execute();
      await trx.schema.dropTable('agendas').ifExists().execute();

      await trx.schema.dropTable('user_packages').ifExists().execute();

      await trx.schema.dropTable('class_assets').ifExists().execute();
      await trx.schema.dropTable('class_locations').ifExists().execute();

      await trx.schema.dropTable('classes').ifExists().execute();

      await trx.schema.dropTable('location_assets').ifExists().execute();
      // await trx.schema.dropTable('facility_equipments').ifExists().execute();
      await trx.schema.dropTable('location_facilities').ifExists().execute();
      await trx.schema
        .dropTable('location_operational_hours')
        .ifExists()
        .execute();

      await trx.schema.dropTable('vouchers').ifExists().execute();

      await trx.schema.dropTable('coaches').ifExists().execute();
      await trx.schema.dropTable('user_sessions').ifExists().execute();
      await trx.schema.dropTable('reset_password').ifExists().execute();
      await trx.schema.dropTable('otp').ifExists().execute();
      await trx.schema.dropTable('users').ifExists().execute();

      await trx.schema.dropTable('packages').ifExists().execute();
      await trx.schema.dropTable('locations').ifExists().execute();

      await trx.schema.dropTable('class_types').ifExists().execute();
      await trx.schema.dropTable('deposit_accounts').ifExists().execute();
    });

    console.log('Tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
}
