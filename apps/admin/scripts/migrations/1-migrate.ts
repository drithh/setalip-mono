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
        .addColumn('email', 'text', (col) => col.notNull())
        .addColumn('phone_number', 'text', (col) => col.notNull())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('address', 'text', (col) => col.notNull())
        .addColumn('link_maps', 'text', (col) => col.notNull())
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('users')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('email', 'text', (col) => col.notNull().unique())
        .addColumn('hashed_password', 'text', (col) => col.notNull())
        .addColumn('phone_number', 'text', (col) => col.notNull())
        .addColumn('address', 'text', (col) => col.notNull())
        .addColumn(
          'role',
          sql`ENUM('admin', 'user', 'coach', 'owner')`,
          (col) => col.notNull()
        )
        .addColumn('location_id', 'bigint', (col) =>
          col.references('locations.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('otp')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('otp', 'text', (col) => col.notNull())
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
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
        .createTable('coaches')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('location_opening_hours')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('day_of_week', 'int4', (col) => col.notNull())
        .addColumn('opening_time', 'time', (col) => col.notNull())
        .addColumn('closing_time', 'time', (col) => col.notNull())
        .addColumn('location_id', 'bigint', (col) =>
          col.references('locations.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('location_facilities')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('capacity', 'int4', (col) => col.notNull())
        .addColumn('level', 'int4', (col) => col.notNull())
        .addColumn('image_url', 'text', (col) => col.notNull())
        .addColumn('location_id', 'bigint', (col) =>
          col.references('locations.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('facility_equipments')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('location_facility_id', 'bigint', (col) =>
          col.references('location_facilities.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('location_assets')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('url', 'text', (col) => col.notNull())
        .addColumn('type', 'text', (col) => col.notNull())
        .addColumn('location_id', 'bigint', (col) =>
          col.references('locations.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('credits')
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
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('loyalty_points', 'int4', (col) => col.notNull())
        .addColumn('type_id', 'bigint', (col) => col.references('credits.id'))
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('user_packages')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('credit', 'int4', (col) => col.notNull())
        .addColumn('price', 'int4', (col) => col.notNull())
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('typed_id', 'bigint', (col) => col.references('credits.id'))
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('package_id', 'bigint', (col) =>
          col.notNull().references('packages.id')
        )
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('classes')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('number', 'text', (col) => col.notNull())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('duration', 'int4', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
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
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('class_assets')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
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
        .addColumn('instructor_id', 'bigint', (col) =>
          col.notNull().references('coaches.id')
        )
        .addColumn('location_id', 'bigint', (col) =>
          col.notNull().references('locations.id')
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
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('notes', 'text', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('credit_id', 'bigint', (col) => col.references('credits.id'))
        .$call(addDefaultColumns)
        .execute();

      await trx.schema
        .createTable('loyalty_rewards')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('credit', 'int4', (col) => col.notNull().unsigned())
        .execute();

      // buyable
      await trx.schema
        .createTable('loyalty_shops')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('name', 'text', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('purchasable', 'boolean', (col) => col.notNull())
        .addColumn('price', 'int4', (col) => col.unsigned())
        .addColumn('image_url', 'text', (col) => col.notNull())
        .addCheckConstraint(
          'loyalty_unpurchasable_item',
          sql`purchasable = false AND price IS NULL OR purchasable = true AND price IS NOT NULL`
        )
        .$call(addDefaultColumns);

      await trx.schema
        .createTable('loyalty_transactions')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('type', sql`ENUM('debit', 'credit')`, (col) => col.notNull())
        .addColumn('amount', 'int4', (col) => col.notNull())
        .addColumn('notes', 'text', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) =>
          col.notNull().references('users.id')
        )
        .addColumn('loyalty_reward_id', 'bigint', (col) =>
          col.references('loyalty_rewards.id')
        )
        .$call(addDefaultColumns);

      await trx.schema
        .createTable('vouchers')
        .addColumn('id', 'bigint', (col) => col.primaryKey().autoIncrement())
        .addColumn('code', 'text', (col) => col.notNull().unique())
        .addColumn('discount', 'int4', (col) => col.notNull())
        .addColumn('type', sql`ENUM('percentage', 'fixed')`, (col) =>
          col.notNull()
        )
        .addColumn('expired_at', 'timestamp', (col) => col.notNull())
        .addColumn('one_time_only', 'boolean', (col) => col.notNull())
        .addColumn('user_id', 'bigint', (col) => col.references('users.id'))
        .addCheckConstraint(
          'discount_percentage_max',
          sql`type = 'percentage' AND discount <= 100`
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
      await trx.schema.dropTable('vouchers').execute();
      await trx.schema.dropTable('loyalty_transactions').execute();
      await trx.schema.dropTable('loyalty_shops').execute();
      await trx.schema.dropTable('loyalty_rewards').execute();
      await trx.schema.dropTable('credit_transactions').execute();
      await trx.schema.dropTable('agenda_bookings').execute();
      await trx.schema.dropTable('agendas').execute();
      await trx.schema.dropTable('class_assets').execute();
      await trx.schema.dropTable('class_locations').execute();
      await trx.schema.dropTable('classes').execute();
      await trx.schema.dropTable('user_packages').execute();
      await trx.schema.dropTable('packages').execute();
      await trx.schema.dropTable('credits').execute();
      await trx.schema.dropTable('location_assets').execute();
      await trx.schema.dropTable('facility_equipments').execute();
      await trx.schema.dropTable('location_facilities').execute();
      await trx.schema.dropTable('location_opening_hours').execute();
      await trx.schema.dropTable('coaches').execute();
      await trx.schema.dropTable('user_sessions').execute();
      await trx.schema.dropTable('otp').execute();
      await trx.schema.dropTable('users').execute();
      await trx.schema.dropTable('locations').execute();
    });

    console.log('Tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
}
