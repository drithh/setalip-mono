import {
  DeleteResult,
  InsertResult,
  Insertable,
  Selectable,
  UpdateResult,
  Updateable,
} from 'kysely';
import { ResetPassword } from '../db';
import { OptionalToRequired } from '.';

export type SelectResetPassword = Selectable<ResetPassword>;
export type InsertResetPassword = Insertable<ResetPassword>;
export type UpdateResetPassword = OptionalToRequired<
  Updateable<ResetPassword>,
  'id'
>;

export interface ResetPasswordRepository {
  findResetPasswordByUserId(
    userId: SelectResetPassword['user_id']
  ): Promise<SelectResetPassword | undefined>;
  createResetPassword(data: InsertResetPassword): Promise<InsertResult>;
  updateResetPassword(data: UpdateResetPassword): Promise<UpdateResult>;
  deleteResetPassword(data: SelectResetPassword['id']): Promise<DeleteResult>;
  deleteResetPasswordByUserId(
    data: SelectResetPassword['user_id']
  ): Promise<DeleteResult>;
}
