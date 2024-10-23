import { injectable, inject, id } from 'inversify';
import { TYPES } from '../inversify';
import {
  ClassTypeService,
  FindAllIncomeByMonthAndLocationOption,
} from './index';
import type {
  ClassTypeRepository,
  InsertClassType,
  SelectClassType,
  UpdateClassType,
} from '../repository';
import { revalidateTag, unstable_cache } from 'next/cache';
import { Expression, expressionBuilder, sql, SqlBool } from 'kysely';
import { format } from 'date-fns';
import { DB, db } from '../db';
import { create } from 'domain';
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

  async findAllIncomeByMonthAndLocation(
    data: FindAllIncomeByMonthAndLocationOption
  ) {
    const { date, location_id } = data;
    const customFilters: Expression<SqlBool>[] = [];
    const eb = expressionBuilder<
      DB,
      'agendas' | 'agenda_bookings' | 'locations'
    >();
    customFilters.push(eb('locations.id', '=', location_id));
    customFilters.push(eb('agenda_bookings.status', '=', 'checked_in'));
    customFilters.push(sql`MONTH(agendas.time) = ${format(date, 'MM')}`);
    customFilters.push(sql`YEAR(agendas.time) = ${format(date, 'yyyy')}`);

    const agendaBooking = await this._classTypeRepository.find({
      withIncome: true,
      customFilters,
    });

    return {
      result: agendaBooking,
      error: undefined,
    };
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

    revalidateTag('class-types-cache');
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
    revalidateTag('class-types-cache');
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
    revalidateTag('class-types-cache');
    return {
      result,
    };
  }
}
