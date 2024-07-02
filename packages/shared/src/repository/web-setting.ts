import { Insertable, Selectable, Updateable } from 'kysely';
import { FrequentlyAskedQuestions, Reviews, WebSettings } from '../db';
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

export interface SelectContact {
  instagram: string;
  tiktok: string;
  frequenly_asked_questions: Selectable<FrequentlyAskedQuestions>[];
}

export interface SelectLogo {
  logo: string;
}

export interface SelectAllReview extends Selectable<Reviews> {
  name: SelectUser['name'];
  email: SelectUser['email'];
  joined_at: SelectUser['created_at'];
}

export interface WebSettingRepository {
  findContact(): Promise<SelectContact | undefined>;
  findLogo(): Promise<SelectLogo | undefined>;
  findAllReview(): Promise<SelectAllReview[]>;
  findTermsAndConditions(): Promise<string | undefined>;
  findPrivacyPolicy(): Promise<string | undefined>;
}
