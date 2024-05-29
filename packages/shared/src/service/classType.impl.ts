import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import * as repository from '../repository';
import { ClassTypeService } from './classType';

@injectable()
export class ClassTypeServiceImpl implements ClassTypeService {
  private _classTypeRepository: repository.ClassTypeRepository;

  constructor(
    @inject(TYPES.ClassTypeRepository)
    classTypeRepository: repository.ClassTypeRepository
  ) {
    this._classTypeRepository = classTypeRepository;
  }

  async findAll() {
    const classTypes = await this._classTypeRepository.findAll();

    return {
      result: classTypes,
      error: undefined,
    };
  }

  async findById(id: repository.SelectClassType['id']) {
    const classType = await this._classTypeRepository.findById(id);

    if (!classType) {
      return {
        error: new Error('Class type not found'),
      };
    }

    return {
      result: classType,
    };
  }

  async create(data: repository.InsertClassType) {
    const result = await this._classTypeRepository.create(data);

    if (result instanceof Error) {
      return {
        error: result,
      };
    }

    return {
      result,
    };
  }

  async update(data: repository.UpdateClassType) {
    const result = await this._classTypeRepository.update(data);

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

  async delete(id: repository.SelectClassType['id']) {
    const result = await this._classTypeRepository.delete(id);

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
