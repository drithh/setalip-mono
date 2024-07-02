import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify';
import type { WebSettingRepository } from '../repository';
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
}
