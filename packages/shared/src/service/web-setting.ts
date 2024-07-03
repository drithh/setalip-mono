import {
  InsertDepositAccount,
  InsertFrequentlyAskedQuestion,
  InsertReview,
  SelectAllDepositAccount,
  SelectAllFrequentlyAskedQuestion,
  SelectAllReview,
  SelectContact,
  SelectDepositAccount,
  SelectFrequentlyAskedQuestion,
  SelectLogo,
  SelectReview,
  UpdateDepositAccount,
  UpdateFrequentlyAskedQuestion,
  UpdateReview,
  UpdateWebSetting,
  findAllDepositAccountOption,
  findAllFrequentlyAskedQuestionOption,
  findAllReviewOption,
} from '../repository';
import { PromiseResult } from '../types';

export interface WebSettingService {
  findContact(): PromiseResult<SelectContact | undefined, Error>;
  findLogo(): PromiseResult<SelectLogo | undefined, Error>;
  findAllFrequentlyAskedQuestion(
    data: findAllFrequentlyAskedQuestionOption
  ): PromiseResult<SelectAllFrequentlyAskedQuestion, Error>;
  findAllDepositAccount(
    data: findAllDepositAccountOption
  ): PromiseResult<SelectAllDepositAccount, Error>;
  findAllReview(
    data: findAllReviewOption
  ): PromiseResult<SelectAllReview, Error>;
  findTermsAndConditions(): PromiseResult<string, Error>;
  findPrivacyPolicy(): PromiseResult<string, Error>;

  createDepositAccount(
    data: InsertDepositAccount
  ): PromiseResult<SelectDepositAccount, Error>;
  createReview(data: InsertReview): PromiseResult<SelectReview, Error>;
  createFrequentlyAskedQuestion(
    data: InsertFrequentlyAskedQuestion
  ): PromiseResult<SelectFrequentlyAskedQuestion, Error>;

  update(data: UpdateWebSetting[]): PromiseResult<undefined, Error>;
  updateDepositAccount(
    data: UpdateDepositAccount
  ): PromiseResult<undefined, Error>;
  updateReview(data: UpdateReview): PromiseResult<undefined, Error>;
  updateFrequentlyAskedQuestion(
    data: UpdateFrequentlyAskedQuestion
  ): PromiseResult<undefined, Error>;

  deleteDepositAccount(
    id: SelectDepositAccount['id']
  ): PromiseResult<undefined, Error>;
  deleteReview(id: SelectReview['id']): PromiseResult<undefined, Error>;
  deleteFrequentlyAskedQuestion(
    id: SelectFrequentlyAskedQuestion['id']
  ): PromiseResult<undefined, Error>;
}
