import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  InsertDepositAccount,
  InsertFrequentlyAskedQuestions,
  InsertReview,
  SelectDepositAccount,
  SelectFrequencyAskedQuestions,
  SelectReview,
  UpdateDepositAccount,
  UpdateFrequentlyAskedQuestions,
  UpdateReview,
  UpdateWebSetting,
  WebSettingRepository,
} from '../repository';
import { WebSettingService } from './web-setting';

@injectable()
export class WebSettingServiceImpl implements WebSettingService {
  private _webSettingRepository: WebSettingRepository;

  constructor(
    @inject(TYPES.WebSettingRepository)
    webSettingRepository: WebSettingRepository
  ) {
    this._webSettingRepository = webSettingRepository;
  }

  async findContact() {
    const contact = await this._webSettingRepository.findContact();

    if (!contact) {
      return {
        error: new Error('Contact not found'),
      };
    }

    return {
      result: contact,
    };
  }

  async findLogo() {
    const logo = await this._webSettingRepository.findLogo();
    if (!logo) {
      return {
        error: new Error('Logo not found'),
      };
    }
    return {
      result: logo,
    };
  }

  async findAllDepositAccount() {
    const depositAccounts =
      await this._webSettingRepository.findAllDepositAccount();

    return {
      result: depositAccounts,
      error: undefined,
    };
  }

  async findAllReview() {
    const faq = await this._webSettingRepository.findAllReview();

    return {
      result: faq,
      error: undefined,
    };
  }

  async findTermsAndConditions() {
    const termsAndConditions =
      await this._webSettingRepository.findTermsAndConditions();

    return {
      result: termsAndConditions || '',
      error: undefined,
    };
  }

  async findPrivacyPolicy() {
    const privacyPolicy = await this._webSettingRepository.findPrivacyPolicy();

    return {
      result: privacyPolicy || '',
      error: undefined,
    };
  }

  async createDepositAccount(data: InsertDepositAccount) {
    const depositAccount =
      await this._webSettingRepository.createDepositAccount(data);

    if (depositAccount instanceof Error) {
      return {
        error: depositAccount,
      };
    }

    return {
      result: depositAccount,
    };
  }

  async createReview(data: InsertReview) {
    const review = await this._webSettingRepository.createReview(data);

    if (review instanceof Error) {
      return {
        error: review,
      };
    }

    return {
      result: review,
    };
  }

  async createFrequentlyAskedQuestions(data: InsertFrequentlyAskedQuestions) {
    const faq =
      await this._webSettingRepository.createFrequentlyAskedQuestions(data);

    if (faq instanceof Error) {
      return {
        error: faq,
      };
    }

    return {
      result: faq,
    };
  }

  async update(data: UpdateWebSetting) {
    const result = await this._webSettingRepository.update(data);

    if (result instanceof Error) {
      return {
        result: undefined,
        error: result,
      };
    }

    return {
      result: undefined,
    };
  }

  async updateDepositAccount(data: UpdateDepositAccount) {
    const result = await this._webSettingRepository.updateDepositAccount(data);

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

  async updateReview(data: UpdateReview) {
    const result = await this._webSettingRepository.updateReview(data);

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

  async updateFrequentlyAskedQuestions(data: UpdateFrequentlyAskedQuestions) {
    const result =
      await this._webSettingRepository.updateFrequentlyAskedQuestions(data);

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

  async deleteDepositAccount(id: SelectDepositAccount['id']) {
    const result = await this._webSettingRepository.deleteDepositAccount(id);

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

  async deleteReview(id: SelectReview['id']) {
    const result = await this._webSettingRepository.deleteReview(id);

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

  async deleteFrequentlyAskedQuestions(
    id: SelectFrequencyAskedQuestions['id']
  ) {
    const result =
      await this._webSettingRepository.deleteFrequentlyAskedQuestions(id);

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
