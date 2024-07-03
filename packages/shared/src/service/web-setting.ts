import {
  InsertDepositAccount,
  InsertFrequentlyAskedQuestions,
  InsertReview,
  SelectAllReview,
  SelectContact,
  SelectDepositAccount,
  SelectFrequencyAskedQuestions,
  SelectLogo,
  SelectReview,
  UpdateDepositAccount,
  UpdateFrequentlyAskedQuestions,
  UpdateReview,
  UpdateWebSetting,
} from '../repository';
import { PromiseResult } from '../types';

export interface WebSettingService {
  findContact(): PromiseResult<SelectContact | undefined, Error>;
  findLogo(): PromiseResult<SelectLogo | undefined, Error>;
  findAllDepositAccount(): PromiseResult<SelectDepositAccount[], Error>;
  findAllReview(): PromiseResult<SelectAllReview[], Error>;
  findTermsAndConditions(): PromiseResult<string, Error>;
  findPrivacyPolicy(): PromiseResult<string, Error>;

  createDepositAccount(
    data: InsertDepositAccount
  ): PromiseResult<SelectDepositAccount, Error>;
  createReview(data: InsertReview): PromiseResult<SelectReview, Error>;
  createFrequentlyAskedQuestions(
    data: InsertFrequentlyAskedQuestions
  ): PromiseResult<SelectFrequencyAskedQuestions, Error>;

  update(data: UpdateWebSetting): PromiseResult<undefined, Error>;
  updateDepositAccount(
    data: UpdateDepositAccount
  ): PromiseResult<undefined, Error>;
  updateReview(data: UpdateReview): PromiseResult<undefined, Error>;
  updateFrequentlyAskedQuestions(
    data: UpdateFrequentlyAskedQuestions
  ): PromiseResult<undefined, Error>;

  deleteDepositAccount(
    id: SelectDepositAccount['id']
  ): PromiseResult<undefined, Error>;
  deleteReview(id: SelectReview['id']): PromiseResult<undefined, Error>;
  deleteFrequentlyAskedQuestions(
    id: SelectFrequencyAskedQuestions['id']
  ): PromiseResult<undefined, Error>;
}
