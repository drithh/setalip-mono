import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import { ClassTypeService } from './index';
import type {
  ClassTypeRepository,
  InsertClassType,
  SelectClassType,
  UpdateClassType,
} from '../repository';
import { unstable_cache } from 'next/cache';
import { sql } from 'kysely';
import { format } from 'path';
import { db } from '../db';
@injectable()
export class ClassTypeServiceImpl implements ClassTypeService {
  private _classTypeRepository: ClassTypeRepository;

  constructor(
    @inject(TYPES.ClassTypeRepository)
    classTypeRepository: ClassTypeRepository
  ) {
    this._classTypeRepository = classTypeRepository;
  }

  async findAll() {
    const getCachedClassTypes = unstable_cache(
      async () => await this._classTypeRepository.find(),
      ['class-types-cache']
    );

    const classTypes = await getCachedClassTypes();

    return {
      result: classTypes,
      error: undefined,
    };
  }

  async findAllIncomeByMonthAndLocation() {
    async findAllAgendaBookingByMonthAndLocation(
      data: FindAllAgendaBookingByMonthAndLocation
    ) {
      const { date, location_id } = data;
      const query = await db
        .selectFrom('agenda_bookings')
        .innerJoin('agendas', 'agenda_bookings.agenda_id', 'agendas.id')
        .innerJoin('class_types', 'agendas.class_id', 'class_types.id')
        .innerJoin(
          'location_facilities',
          'agendas.location_facility_id',
          'location_facilities.id'
        )
        .innerJoin('locations', 'location_facilities.location_id', 'locations.id')
        .innerJoin(
          'credit_transactions',
          'agenda_bookings.id',
          'credit_transactions.agenda_booking_id'
        )
        .innerJoin(
          'user_packages',
          'credit_transactions.user_package_id',
          'user_packages.id'
        )
        .innerJoin(
          'package_transactions',
          'user_packages.id',
          'package_transactions.user_package_id'
        )
        .select([
          'class_types.id as class_type_id',
          'class_types.type as class_type_name',
          sql<number>`count(agenda_bookings.id)`.as('participant'),
          sql<number>`sum(IFNULL(package_transactions.amount_paid / package_transactions.credit, 0))`.as(
            'income'
          ),
        ])
        .where('locations.id', '=', location_id)
        .where('agenda_bookings.status', '=', 'checked_in')
        .where(sql`MONTH(agendas.time)`, '=', format(date, 'MM'))
        .where(sql`YEAR(agendas.time)`, '=', format(date, 'yyyy'))
        .execute();
  
      const agendaBooking =
        await this._agendaRepository.findAllAgendaBookingByMonthAndLocation(data);
  
      return {
        result: agendaBooking,
        error: undefined,
      };
    }
  }

  async findById(id: SelectClassType['id']) {
    const classType = await this._classTypeRepository.find({
      filters: { id },
    });

    if (classType.length === 0) {
      return {
        error: new Error('Class type not found'),
      };
    }

    return {
      result: classType[0],
    };
  }

  async create(data: InsertClassType) {
    const result = await this._classTypeRepository.create({
      data,
    });

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateClassType) {
    const result = await this._classTypeRepository.update({ data });

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result,
    };
  }

  async delete(id: SelectClassType['id']) {
    const result = await this._classTypeRepository.delete({
      filters: { id },
    });

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result,
    };
  }
}
