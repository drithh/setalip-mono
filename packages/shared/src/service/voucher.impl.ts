import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  // FindAllClassOptions,
  InsertVoucher,
  VoucherRepository,
  SelectVoucher,
  UpdateVoucher,
  FindAllVoucherOptions,
} from '../repository';
import { VoucherService } from './voucher';

@injectable()
export class VoucherServiceImpl implements VoucherService {
  private _voucherRepository: VoucherRepository;

  constructor(
    @inject(TYPES.VoucherRepository) voucherRepository: VoucherRepository
  ) {
    this._voucherRepository = voucherRepository;
  }

  async findAll(data: FindAllVoucherOptions) {
    const voucheres = await this._voucherRepository.findAll(data);

    return {
      result: voucheres,
      error: undefined,
    };
  }

  async findById(id: SelectVoucher['id']) {
    const voucher = await this._voucherRepository.findById(id);

    if (!voucher) {
      return {
        error: new Error('Voucher not found'),
      };
    }

    return {
      result: voucher,
    };
  }

  async findByUserId(userId: SelectVoucher['user_id']) {
    const voucher = await this._voucherRepository.findByUserId(userId);

    if (!voucher) {
      return {
        error: new Error('Voucher not found'),
      };
    }

    return {
      result: voucher,
    };
  }

  async create(data: InsertVoucher) {
    const result = await this._voucherRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateVoucher) {
    const result = await this._voucherRepository.update(data);

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

  async delete(id: SelectVoucher['id']) {
    const result = await this._voucherRepository.delete(id);

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
}
