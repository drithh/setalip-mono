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
  findByUserId(
    userId: SelectResetPassword['user_id']
  ): Promise<SelectResetPassword | undefined>;
  findByToken(
    token: SelectResetPassword['token']
  ): Promise<SelectResetPassword | undefined>;
  create(data: InsertResetPassword): Promise<SelectResetPassword | Error>;
  update(data: UpdateResetPassword): Promise<undefined | Error>;
  delete(data: SelectResetPassword['id']): Promise<undefined | Error>;
  deleteByUserId(
    data: SelectResetPassword['user_id']
  ): Promise<undefined | Error>;
}
