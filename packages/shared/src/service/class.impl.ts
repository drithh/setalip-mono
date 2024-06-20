import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  FindAllClassOptions,
  InsertClass,
  ClassRepository,
  SelectClass,
  UpdateClass,
} from '../repository';
import { ClassService } from './class';

@injectable()
export class ClassServiceImpl implements ClassService {
  private _classRepository: ClassRepository;

  constructor(@inject(TYPES.ClassRepository) classRepository: ClassRepository) {
    this._classRepository = classRepository;
  }

  async findAll(data: FindAllClassOptions) {
    const classes = await this._classRepository.findAll(data);

    return {
      result: classes,
      error: undefined,
    };
  }

  async findAllClassWithAsset(data: FindAllClassOptions) {
    const classes = await this._classRepository.findAllClassWithAsset(data);

    return {
      result: classes,
      error: undefined,
    };
  }

  async findById(id: SelectClass['id']) {
    const singleClass = await this._classRepository.findById(id);

    if (!singleClass) {
      return {
        error: new Error('Class not found'),
      };
    }

    return {
      result: singleClass,
    };
  }

  async findDetailClassAssetAndLocation(id: SelectClass['id']) {
    const singleClass =
      await this._classRepository.findDetailClassAssetAndLocation(id);

    if (!singleClass) {
      return {
        error: new Error('Class not found'),
      };
    }

    return {
      result: singleClass,
    };
  }

  async create(data: InsertClass) {
    const result = await this._classRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateClass) {
    const result = await this._classRepository.update(data);

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

  async delete(id: SelectClass['id']) {
    const result = await this._classRepository.delete(id);

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
