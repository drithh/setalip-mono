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
  FindAllCreditOptions,
} from '../repository';
import { CreditService } from './credit';

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
    const credit = await this._creditRepository.find({ filters, limit: 1 });

    if (credit.length < 0) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit[0],
    };
  }

  async findByUserPackageId(id: SelectCredit['user_package_id']) {
    const filters = {
      user_package_id: id,
    };
    const credit = await this._creditRepository.find({ filters, limit: 1 });

    if (credit.length < 0) {
      return {
        error: new Error('Credit not found'),
      };
    }

    return {
      result: credit[0],
    };
  }

  async findAllByUserId(data: FindAllCreditOptions) {
    const credit = await this._creditRepository.findAllByUserId(data);

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
    const classType = await this._classTypeRepository.findById(
      data.class_type_id
    );

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

    const result = await this._creditRepository.create(insertedData);

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
    const result = await this._creditRepository.update(data);

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
