import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type {
  InsertCarousel,
  InsertDepositAccount,
  InsertFrequentlyAskedQuestion,
  InsertReview,
  SelectCarousel,
  SelectDepositAccount,
  SelectFrequentlyAskedQuestion,
  SelectReview,
  UpdateCarousel,
  UpdateDepositAccount,
  UpdateFrequentlyAskedQuestion,
  UpdateReview,
  UpdateWebSetting,
  WebSettingRepository,
  findAllDepositAccountOption,
  findAllFrequentlyAskedQuestionOption,
  findAllReviewOption,
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

  async findAllFrequentlyAskedQuestion(
    data: findAllFrequentlyAskedQuestionOption
  ) {
    const faq =
      await this._webSettingRepository.findAllFrequentlyAskedQuestion(data);

    return {
      result: faq,
      error: undefined,
    };
  }

  async findAllDepositAccount(data: findAllDepositAccountOption) {
    const depositAccounts =
      await this._webSettingRepository.findAllDepositAccount(data);

    return {
      result: depositAccounts,
      error: undefined,
    };
  }

  async findAllReview(data: findAllReviewOption) {
    const faq = await this._webSettingRepository.findAllReview(data);

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

  async findAllCarousel() {
    const carousels = await this._webSettingRepository.findAllCarousel();

    return {
      result: carousels,
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

  async createFrequentlyAskedQuestion(data: InsertFrequentlyAskedQuestion) {
    const faq =
      await this._webSettingRepository.createFrequentlyAskedQuestion(data);

    if (faq instanceof Error) {
      return {
        error: faq,
      };
    }

    return {
      result: faq,
    };
  }

  async createCarousel(data: InsertCarousel) {
    const carousel = await this._webSettingRepository.createCarousel(data);

    if (carousel instanceof Error) {
      return {
        error: carousel,
      };
    }

    return {
      result: carousel,
    };
  }

  async update(data: UpdateWebSetting[]) {
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

  async updateFrequentlyAskedQuestion(data: UpdateFrequentlyAskedQuestion) {
    const result =
      await this._webSettingRepository.updateFrequentlyAskedQuestion(data);

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

  async updateCarousel(data: UpdateCarousel) {
    const result = await this._webSettingRepository.updateCarousel(data);

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

  async deleteFrequentlyAskedQuestion(id: SelectFrequentlyAskedQuestion['id']) {
    const result =
      await this._webSettingRepository.deleteFrequentlyAskedQuestion(id);

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

  async deleteCarousel(id: SelectCarousel['id']) {
    const result = await this._webSettingRepository.deleteCarousel(id);

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
