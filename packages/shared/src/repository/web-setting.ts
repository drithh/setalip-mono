import { Insertable, Selectable, Updateable } from 'kysely';
import {
  Carousels,
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
export type UpdateWebSetting = Updateable<WebSettings>;

export type SelectFrequentlyAskedQuestion =
  Selectable<FrequentlyAskedQuestions>;
export interface SelectContact {
  instagram_handle: string;
  tiktok_handle: string;
}

export interface SelectLogo {
  logo: string;
}

export type SelectReview = Selectable<Reviews>;
export interface SelectReviewWithUser extends SelectReview {
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

export type InsertFrequentlyAskedQuestion =
  Insertable<FrequentlyAskedQuestions>;
export type UpdateFrequentlyAskedQuestion = OptionalToRequired<
  Updateable<FrequentlyAskedQuestions>,
  'id'
>;

export interface findAllFrequentlyAskedQuestionOption
  extends DefaultPagination {
  question?: SelectFrequentlyAskedQuestion['question'];
}

export interface SelectAllFrequentlyAskedQuestion {
  data: SelectFrequentlyAskedQuestion[];
  pageCount: number;
}

export interface findAllReviewOption extends DefaultPagination {
  email?: SelectUser['email'];
}

export interface SelectAllReview {
  data: SelectReviewWithUser[];
  pageCount: number;
}

export interface findAllDepositAccountOption extends DefaultPagination {
  name?: SelectDepositAccount['name'];
}

export interface SelectAllDepositAccount {
  data: SelectDepositAccount[];
  pageCount: number;
}

export type SelectCarousel = Selectable<Carousels>;
export type InsertCarousel = Insertable<Carousels>;
export type UpdateCarousel = OptionalToRequired<Updateable<Carousels>, 'id'>;

export interface WebSettingRepository {
  findContact(): Promise<SelectContact | undefined>;
  findLogo(): Promise<SelectLogo | undefined>;
  findAllFrequentlyAskedQuestion(
    data: findAllFrequentlyAskedQuestionOption
  ): Promise<SelectAllFrequentlyAskedQuestion>;
  findAllDepositAccount(
    data: findAllDepositAccountOption
  ): Promise<SelectAllDepositAccount>;
  findDepositAccountById(
    id: SelectDepositAccount['id']
  ): Promise<SelectDepositAccount | undefined>;
  findAllReview(data: findAllReviewOption): Promise<SelectAllReview>;
  findTermsAndConditions(): Promise<string | undefined>;
  findPrivacyPolicy(): Promise<string | undefined>;
  findAllCarousel(): Promise<SelectCarousel[]>;

  createDepositAccount(
    data: InsertDepositAccount
  ): Promise<SelectDepositAccount | Error>;
  createReview(data: InsertReview): Promise<SelectReview | Error>;
  createFrequentlyAskedQuestion(
    data: InsertFrequentlyAskedQuestion
  ): Promise<SelectFrequentlyAskedQuestion | Error>;
  createCarousel(data: InsertCarousel): Promise<SelectCarousel | Error>;

  update(data: UpdateWebSetting[]): Promise<undefined | Error>;
  updateDepositAccount(data: UpdateDepositAccount): Promise<undefined | Error>;
  updateReview(data: UpdateReview): Promise<undefined | Error>;
  updateFrequentlyAskedQuestion(
    data: UpdateFrequentlyAskedQuestion
  ): Promise<undefined | Error>;
  updateCarousel(data: UpdateCarousel): Promise<undefined | Error>;

  deleteDepositAccount(
    id: SelectDepositAccount['id']
  ): Promise<undefined | Error>;
  deleteReview(id: SelectReview['id']): Promise<undefined | Error>;
  deleteFrequentlyAskedQuestion(
    id: SelectFrequentlyAskedQuestion['id']
  ): Promise<undefined | Error>;
  deleteCarousel(id: SelectCarousel['id']): Promise<undefined | Error>;
}
