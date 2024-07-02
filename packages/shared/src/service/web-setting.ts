import { SelectAllReview, SelectContact, SelectLogo } from '../repository';
import { PromiseResult } from '../types';

export interface WebSettingService {
  findContact(): PromiseResult<SelectContact | undefined, Error>;
  findLogo(): PromiseResult<SelectLogo | undefined, Error>;
  findAllReview(): PromiseResult<SelectAllReview[], Error>;
  findTermsAndConditions(): PromiseResult<string, Error>;
  findPrivacyPolicy(): PromiseResult<string, Error>;
}
