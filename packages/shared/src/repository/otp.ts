import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import { Otp } from '../db';
import { OptionalToRequired } from '.';

export type SelectOtp = Selectable<Otp>;
export type InsertOtp = Insertable<Otp>;
export type UpdateOtp = OptionalToRequired<Updateable<Otp>, 'id'>;

export interface OtpRepository {
  findOtpByUserId(userId: SelectOtp['user_id']): Promise<SelectOtp | undefined>;
  createOtp(data: InsertOtp): Promise<InsertResult>;
  updateOtp(data: UpdateOtp): Promise<UpdateResult>;
  deleteOtp(data: SelectOtp['id']): Promise<DeleteResult>;
  deleteOtpByUserId(data: SelectOtp['user_id']): Promise<DeleteResult>;
}
