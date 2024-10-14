import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  FindAllClassOptions,
  InsertClass,
  ClassRepository,
  SelectClass,
  UpdateClass,
  ClassTypeRepository,
  InsertClassAsset,
  SelectClassAsset,
  UpdateClassWithLocation,
} from '../repository';
import { ClassService } from './class';

@injectable()
export class ClassServiceImpl implements ClassService {
  private _classRepository: ClassRepository;
  private _classTypeRepository: ClassTypeRepository;

  constructor(
    @inject(TYPES.ClassRepository) classRepository: ClassRepository,
    @inject(TYPES.ClassTypeRepository) classTypeRepository: ClassTypeRepository
  ) {
    this._classRepository = classRepository;
    this._classTypeRepository = classTypeRepository;
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
    // find class type
    const classType = await this._classTypeRepository.find({
      filters: {
        id: data.class_type_id,
      },
    });

    if (!classType) {
      return {
        error: new Error('Class type not found'),
      };
    }

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

  async createAsset(data: InsertClassAsset[]) {
    const result = await this._classRepository.createAsset(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: UpdateClassWithLocation) {
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

  async deleteAsset(id: SelectClassAsset['id']) {
    const result = await this._classRepository.deleteAsset(id);

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
