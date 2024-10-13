import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  // FindAllClassOptions,
  InsertCredit,
  CreditRepository,
  SelectCredit,
  UpdateCredit,
  ClassTypeRepository,
  UserRepository,
} from '../repository';
import { FindAllCreditOptions, CreditService } from './credit';

@injectable()
export class CreditServiceImpl implements CreditService {
  private _creditRepository: CreditRepository;
  private _classTypeRepository: ClassTypeRepository;
  private _userRepository: UserRepository;

  constructor(
    @inject(TYPES.CreditRepository) creditRepository: CreditRepository,
    @inject(TYPES.ClassTypeRepository) classTypeRepository: ClassTypeRepository,
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this._creditRepository = creditRepository;
    this._classTypeRepository = classTypeRepository;
    this._userRepository = userRepository;
  }

  async findAll() {
    const credits = await this._creditRepository.find();

    return {
      result: credits,
      error: undefined,
    };
  }

  async findById(id: SelectCredit['id']) {
    const filters = {
      id,
    };
    const credit = (
      await this._creditRepository.find({ filters, perPage: 1 })
    )?.[0];

    if (!credit) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit,
    };
  }

  async findByUserPackageId(id: SelectCredit['user_package_id']) {
    const filters = {
      user_package_id: id,
    };
    const credit = (
      await this._creditRepository.find({ filters, perPage: 1 })
    )?.[0];

    if (!credit) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit,
    };
  }

  async findAllByUserId(data: FindAllCreditOptions) {
    const { page = 1, perPage = 10, sort } = data;
    const offset = (page - 1) * perPage;
    const orderBy = (
      sort?.split('.').filter(Boolean) ?? ['created_at', 'desc']
    ).join(' ') as `${keyof SelectCredit} ${'asc' | 'desc'}`;
    const filters = {
      user_id: data.user_id,
    };
    const credit = await this._creditRepository.findWithPagination({
      filters,
      perPage,
      offset,
      orderBy,
    });

    if (!credit) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit,
    };
  }

  async create(data: InsertCredit) {
    const classType = (
      await this._classTypeRepository.find({
        filters: {
          id: data.class_type_id,
        },
        perPage: 1,
      })
    )?.[0];

    if (!classType) {
      return {
        result: undefined,
        error: new Error('Class type not found'),
      };
    }

    const user = await this._userRepository.findById(data.user_id);

    if (!user) {
      return {
        result: undefined,
        error: new Error('User not found'),
      };
    }

    const insertedData = {
      ...data,
    } satisfies InsertCredit;

    const result = await this._creditRepository.create({
      data: insertedData,
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

  async update(data: UpdateCredit) {
    const result = await this._creditRepository.update({
      data,
      filters: {
        id: data.id,
      },
    });

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: result,
    };
  }

  async deleteByAgendaBookingId(
    agendaBookingId: SelectCredit['agenda_booking_id']
  ) {
    const result = await this._creditRepository.delete({
      filters: {
        agenda_booking_id: agendaBookingId,
      },
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
