import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  // FindAllClassOptions,
  InsertVoucher,
  VoucherRepository,
  SelectVoucher,
  UpdateVoucher,
  FindAllVoucherOptions,
  FindVoucherByCode,
  PackageRepository,
} from '../repository';
import { VoucherService } from './voucher';

@injectable()
export class VoucherServiceImpl implements VoucherService {
  private _voucherRepository: VoucherRepository;
  private _packageRepository: PackageRepository;

  constructor(
    @inject(TYPES.VoucherRepository) voucherRepository: VoucherRepository,
    @inject(TYPES.PackageRepository) packageRepository: PackageRepository
  ) {
    this._voucherRepository = voucherRepository;
    this._packageRepository = packageRepository;
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

  async findByCodeAndUser(data: FindVoucherByCode) {
    const voucher = await this._voucherRepository.findByCodeAndUser(data);

    if (!voucher) {
      return {
        error: new Error('Voucher not found'),
      };
    }

    // check whether user used the voucher
    const packageTransaction =
      await this._packageRepository.findPackageTransactionByVoucherIdAndUserId(
        voucher.id,
        data.user_id ?? 0
      );

    if (packageTransaction) {
      return {
        error: new Error('Voucher already used'),
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
