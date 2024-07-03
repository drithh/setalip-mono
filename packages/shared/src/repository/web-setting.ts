import { Insertable, Selectable, Updateable } from 'kysely';
import {
  DepositAccounts,
  FrequentlyAskedQuestions,
  Reviews,
  WebSettings,
} from '../db';
import {
  DefaultPagination,
  OptionalToRequired,
  SelectClassType,
  SelectUser,
} from '.';

export type SelectWebSetting = Selectable<WebSettings>;
export type InsertWebSetting = Insertable<WebSettings>;
export type UpdateWebSetting = OptionalToRequired<
  Updateable<WebSettings>,
  'id'
>;

export type SelectFrequencyAskedQuestions =
  Selectable<FrequentlyAskedQuestions>;
export interface SelectContact {
  instagram: string;
  tiktok: string;
  frequenly_asked_questions: SelectFrequencyAskedQuestions[];
}

export interface SelectLogo {
  logo: string;
}

export type SelectReview = Selectable<Reviews>;
export interface SelectAllReview extends SelectReview {
  name: SelectUser['name'];
  email: SelectUser['email'];
  joined_at: SelectUser['created_at'];
}

export type SelectDepositAccount = Selectable<DepositAccounts>;
export type InsertDepositAccount = Insertable<DepositAccounts>;
export type UpdateDepositAccount = OptionalToRequired<
  Updateable<DepositAccounts>,
  'id'
>;

export type InsertReview = Insertable<Reviews>;
export type UpdateReview = OptionalToRequired<Updateable<Reviews>, 'id'>;

export type InsertFrequentlyAskedQuestions =
  Insertable<FrequentlyAskedQuestions>;
export type UpdateFrequentlyAskedQuestions = OptionalToRequired<
  Updateable<FrequentlyAskedQuestions>,
  'id'
>;

export interface WebSettingRepository {
  findContact(): Promise<SelectContact | undefined>;
  findLogo(): Promise<SelectLogo | undefined>;
  findAllDepositAccount(): Promise<SelectDepositAccount[]>;
  findAllReview(): Promise<SelectAllReview[]>;
  findTermsAndConditions(): Promise<string | undefined>;
  findPrivacyPolicy(): Promise<string | undefined>;

  createDepositAccount(
    data: InsertDepositAccount
  ): Promise<SelectDepositAccount | Error>;
  createReview(data: InsertReview): Promise<SelectReview | Error>;
  createFrequentlyAskedQuestions(
    data: InsertFrequentlyAskedQuestions
  ): Promise<SelectFrequencyAskedQuestions | Error>;

  update(data: UpdateWebSetting): Promise<undefined | Error>;
  updateDepositAccount(data: UpdateDepositAccount): Promise<undefined | Error>;
  updateReview(data: UpdateReview): Promise<undefined | Error>;
  updateFrequentlyAskedQuestions(
    data: UpdateFrequentlyAskedQuestions
  ): Promise<undefined | Error>;

  deleteDepositAccount(
    id: SelectDepositAccount['id']
  ): Promise<undefined | Error>;
  deleteReview(id: SelectReview['id']): Promise<undefined | Error>;
  deleteFrequentlyAskedQuestions(
    id: SelectFrequencyAskedQuestions['id']
  ): Promise<undefined | Error>;
}
