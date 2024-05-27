import { Insertable, Selectable, Updateable } from 'kysely';
import { Otp } from '../db';
import { OptionalToRequired } from '.';

export type SelectOtp = Selectable<Otp>;
export type InsertOtp = Insertable<Otp>;
export type UpdateOtp = OptionalToRequired<Updateable<Otp>, 'id'>;

export interface OtpRepository {
  findByUserId(userId: SelectOtp['user_id']): Promise<SelectOtp | undefined>;
  create(data: InsertOtp): Promise<SelectOtp | Error>;
  update(data: UpdateOtp): Promise<undefined | Error>;
  deleteByUserId(data: SelectOtp['user_id']): Promise<undefined | Error>;
}
